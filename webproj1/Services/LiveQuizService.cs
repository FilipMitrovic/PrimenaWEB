// Services/LiveQuizService.cs
using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using webproj1.Dto;
using webproj1.Interfaces;
using webproj1.Models.Live;
using webproj1.Hubs; // za IHubContext<LiveQuizHub>
using Microsoft.Extensions.DependencyInjection;

namespace webproj1.Services
{
    public class LiveQuizService : ILiveQuizService
    {
        private readonly IQuizService _quizService;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHubContext<LiveQuizHub> _hub;

        // sobe u memoriji
        private static readonly ConcurrentDictionary<string, LiveRoom> _rooms = new();
        private static readonly ConcurrentDictionary<string, List<QuestionDTO>> _roomQuestions = new();
        private static readonly ConcurrentDictionary<string, CancellationTokenSource> _roomTimers = new();

        private static readonly Random _rng = new();

        public LiveQuizService(IServiceScopeFactory scopeFactory,
                               IHubContext<LiveQuizHub> hub)
        {
            _scopeFactory = scopeFactory;
            _hub = hub;
        }


        public LiveRoom CreateRoom(int quizId, string adminUserId, int questionTimeSec = 30)
        {
            string code;
            do { code = _rng.Next(100000, 999999).ToString(); } while (_rooms.ContainsKey(code));

            var room = new LiveRoom
            {
                RoomCode = code,
                QuizId = quizId,
                AdminUserId = adminUserId,
                QuestionTimeSec = questionTimeSec,
                State = LiveQuestionState.Waiting,
                IsRunning = false
            };
            _rooms[code] = room;
            return room;
        }

        public bool TryGetRoom(string roomCode, out LiveRoom room)
            => _rooms.TryGetValue(roomCode, out room!);

        public bool RemoveRoom(string roomCode)
        {
            _roomQuestions.TryRemove(roomCode, out _);
            if (_roomTimers.TryRemove(roomCode, out var cts))
            {
                try { cts.Cancel(); cts.Dispose(); } catch { }
            }
            return _rooms.TryRemove(roomCode, out _);
        }

        public void AddParticipant(LiveRoom room, LiveParticipant p)
        {
            room.Participants[p.ConnectionId] = p;
            if (!room.Scores.ContainsKey(p.UserId))
                room.Scores[p.UserId] = 0;
        }

        public void RemoveParticipant(LiveRoom room, string connectionId)
        {
            room.Participants.TryRemove(connectionId, out _);
        }

        public async Task<List<QuestionDTO>> LoadQuestionsAsync(int quizId)
        {
            using var scope = _scopeFactory.CreateScope();
            var questionService = scope.ServiceProvider.GetRequiredService<IQuestionService>();
            var list = await questionService.GetQuestionsByQuizId(quizId);
            return list.ToList();
        }

        public RoomSnapshotDTO GetSnapshot(LiveRoom room)
        {
            return new RoomSnapshotDTO
            {
                RoomCode = room.RoomCode,
                QuizId = room.QuizId,
                CurrentQuestionIndex = room.CurrentQuestionIndex,
                TotalQuestions = room.TotalQuestions,
                IsRunning = room.IsRunning,
                State = room.State,
                QuestionTimeSec = room.QuestionTimeSec,
                QuestionStartUtc = room.QuestionStartUtc,
                Leaderboard = room.Scores
                    .Select(kv =>
                    {
                        var display = room.Participants.Values
                            .FirstOrDefault(p => p.UserId == kv.Key)?.DisplayName ?? kv.Key;
                        return new LeaderboardRowDTO
                        {
                            UserId = kv.Key,
                            DisplayName = display,
                            Score = kv.Value
                        };
                    })
                    .OrderByDescending(x => x.Score)
                    .ToList()
            };
        }

        public async Task<(QuestionDTO? question, RoomSnapshotDTO snapshot)> StartQuizAsync(LiveRoom room)
        {
            var questions = await LoadQuestionsAsync(room.QuizId);
            _roomQuestions[room.RoomCode] = questions;
            room.TotalQuestions = questions.Count;

            room.CurrentQuestionIndex = -1;
            room.IsRunning = true;
            room.State = LiveQuestionState.Waiting;

            // odmah pređi na prvo pitanje
            return await NextQuestionAsync(room);
        }

        public async Task<(QuestionDTO? question, RoomSnapshotDTO snapshot)> NextQuestionAsync(LiveRoom room)
        {
            if (!_roomQuestions.TryGetValue(room.RoomCode, out var qs) || qs.Count == 0)
            {
                await EndQuizAsync(room);
                return (null, GetSnapshot(room));
            }

            room.CurrentQuestionIndex++;
            room.AnsweredThisQuestion.Clear();
            room.LastElapsedMs.Clear();

            if (room.CurrentQuestionIndex >= qs.Count)
            {
                await EndQuizAsync(room);
                return (null, GetSnapshot(room));
            }

            var q = qs[room.CurrentQuestionIndex];
            room.State = LiveQuestionState.Running;
            room.QuestionStartUtc = DateTime.UtcNow;

            // pokreni auto-prelaz posle QuestionTimeSec
            ScheduleAutoAdvance(room);

            return (q, GetSnapshot(room));
        }

        private void ScheduleAutoAdvance(LiveRoom room)
        {
            if (_roomTimers.TryGetValue(room.RoomCode, out var oldCts))
            {
                try { oldCts.Cancel(); oldCts.Dispose(); } catch { }
                _roomTimers.TryRemove(room.RoomCode, out _);
            }

            var cts = new CancellationTokenSource();
            _roomTimers[room.RoomCode] = cts;
            var token = cts.Token;
            var roomCode = room.RoomCode;

            // fire-and-forget petlja koja posle isteka vremena automatski pređe na sledeće
            _ = Task.Run(async () =>
            {
                try
                {
                    await Task.Delay(TimeSpan.FromSeconds(room.QuestionTimeSec), token);
                    if (token.IsCancellationRequested) return;

                    if (TryGetRoom(roomCode, out var r) && r.IsRunning)
                    {
                        // broadcast da je pitanje završeno
                        await _hub.Clients.Group(roomCode).SendAsync("QuestionEnded", GetSnapshot(r));

                        // sledeće pitanje
                        var (nextQ, snapshot) = await NextQuestionAsync(r);
                        if (nextQ == null)
                        {
                            await _hub.Clients.Group(roomCode).SendAsync("QuizEnded", snapshot);
                        }
                        else
                        {
                            await _hub.Clients.Group(roomCode).SendAsync("QuestionStarted", nextQ, snapshot);
                        }
                    }
                }
                catch (TaskCanceledException) { /* ignore */ }
                catch (Exception ex)
                {
                    Console.WriteLine($"Auto-advance error: {ex.Message}");
                }
            }, token);
        }

        public async Task EndQuizAsync(LiveRoom room)
        {
            room.IsRunning = false;
            room.State = LiveQuestionState.Finished;
            room.QuestionStartUtc = null;

            if (_roomTimers.TryGetValue(room.RoomCode, out var cts))
            {
                try { cts.Cancel(); cts.Dispose(); } catch { }
                _roomTimers.TryRemove(room.RoomCode, out _);
            }
            await Task.CompletedTask;
        }

        public int ScoreFor(bool isCorrect, int elapsedMs, int questionTimeSec)
        {
            if (!isCorrect) return 0;
            const int basePoints = 100;
            var timeMs = Math.Max(1, questionTimeSec * 1000);
            var ratio = Math.Clamp(1.0 - (elapsedMs / (double)timeMs), 0, 1);
            var bonus = (int)Math.Round(50 * ratio);
            return basePoints + bonus;
        }

        public bool IsAnswerCorrect(QuestionDTO question, SubmitAnswerDTO dto)
        {
            var type = (question.Type ?? "").Trim().ToLowerInvariant();

            if (type is "single" or "one" or "singlechoice" or "jedan")
            {
                // tačna je opcija gde IsCorrect == true
                var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                return correctOption != null && dto.SingleOptionId != null &&
                       dto.SingleOptionId == correctOption.Id.ToString();
            }

            if (type is "multiple" or "multi" or "multiplechoice" or "vise")
            {
                var correctSet = question.Options.Where(o => o.IsCorrect)
                    .Select(o => o.Id.ToString()).OrderBy(x => x).ToArray();
                var givenSet = (dto.MultipleOptionIds ?? new List<string>()).OrderBy(x => x).ToArray();
                return correctSet.SequenceEqual(givenSet);
            }

            if (type is "truefalse" or "tf" or "t/f" or "true/false" or "tacno/netacno")
            {
                // question.Answer sadrži "true" ili "false" po tvojoj šemi
                var expected = (question.Answer ?? "").Trim().ToLowerInvariant();
                var given = (dto.TrueFalse ?? "").Trim().ToLowerInvariant();
                return expected == given;
            }

            if (type is "fill" or "fillintheblank" or "unos" or "text")
            {
                // jednostavno poređenje lowercased + trim
                var expected = (question.Answer ?? "").Trim().ToLowerInvariant();
                var given = (dto.FillText ?? "").Trim().ToLowerInvariant();
                return !string.IsNullOrWhiteSpace(expected) && expected == given;
            }

            // default – ništa ne priznaje
            return false;
        }

        public async Task<(bool correct, int pointsAwarded, RoomSnapshotDTO snapshot)> SubmitAnswerAsync(
            LiveRoom room, string userId, SubmitAnswerDTO dto)
        {
            if (!_roomQuestions.TryGetValue(room.RoomCode, out var qs) ||
                room.State != LiveQuestionState.Running ||
                room.CurrentQuestionIndex < 0 ||
                room.CurrentQuestionIndex >= qs.Count)
            {
                return (false, 0, GetSnapshot(room));
            }

            // spreči višestruke odgovore na isto pitanje
            if (!room.AnsweredThisQuestion.TryAdd(userId, true))
            {
                return (false, 0, GetSnapshot(room));
            }

            var question = qs[room.CurrentQuestionIndex];
            var correct = IsAnswerCorrect(question, dto);
            var points = ScoreFor(correct, Math.Max(0, dto.ElapsedMs), room.QuestionTimeSec);

            if (correct)
            {
                room.Scores.AddOrUpdate(userId, points, (_, prev) => prev + points);
            }

            room.LastElapsedMs[userId] = dto.ElapsedMs;

            // obavesti klijente da se leaderboard osvežio
            var snapshot = GetSnapshot(room);
            await _hub.Clients.Group(room.RoomCode).SendAsync("LeaderboardUpdated", snapshot);

            return (correct, points, snapshot);
        }
    }
}
