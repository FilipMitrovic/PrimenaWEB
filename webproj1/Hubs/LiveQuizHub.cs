// Hubs/LiveQuizHub.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using webproj1.Interfaces;
using webproj1.Models.Live;
using webproj1.Dto;

namespace webproj1.Hubs
{
    [Authorize]
    public class LiveQuizHub : Hub
    {
        private readonly ILiveQuizService _live;

        public LiveQuizHub(ILiveQuizService live)
        {
            _live = live;
        }

        private string GetUserId() =>
            Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? Context.ConnectionId;

        private string GetUserName() =>
            Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? GetUserId();

        private bool IsAdminOfRoom(LiveRoom room)
        {
            var uid = GetUserId();
            return room.AdminUserId == uid ||
                   room.Participants.Values.Any(p => p.UserId == uid && p.IsAdmin);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // ukloni iz svih soba u kojima je bio
            foreach (var group in Context.Items.Keys.ToList())
            {
                var gc = group.ToString();
                if (gc != null && _live.TryGetRoom(gc, out var r))
                {
                    _live.RemoveParticipant(r, Context.ConnectionId);
                    await Clients.Group(gc).SendAsync("UserLeft", GetUserId());
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        // ADMIN kreira sobu
        public async Task<object> AdminCreateRoom(int quizId, int questionTimeSec = 30)
        {
            var adminId = GetUserId();
            var room = _live.CreateRoom(quizId, adminId, questionTimeSec);

            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomCode);

            var participant = new LiveParticipant
            {
                ConnectionId = Context.ConnectionId,
                UserId = adminId,
                DisplayName = GetUserName(),
                IsAdmin = true
            };
            _live.AddParticipant(room, participant);

            var snapshot = _live.GetSnapshot(room);
            await Clients.Caller.SendAsync("RoomUpdated", snapshot);
            return new { roomCode = room.RoomCode };
        }

        // Korisnik ulazi u sobu (ili admin se pridružuje sa drugog taba)
        public async Task JoinRoom(string roomCode, string displayName)
        {
            if (!_live.TryGetRoom(roomCode, out var room))
                throw new HubException("Room not found");

            await Groups.AddToGroupAsync(Context.ConnectionId, roomCode);

            var p = new LiveParticipant
            {
                ConnectionId = Context.ConnectionId,
                UserId = GetUserId(),
                DisplayName = string.IsNullOrWhiteSpace(displayName) ? GetUserName() : displayName,
                IsAdmin = room.AdminUserId == GetUserId()
            };
            _live.AddParticipant(room, p);

            await Clients.Group(roomCode).SendAsync("UserJoined", p.UserId, p.DisplayName);
            await Clients.Caller.SendAsync("RoomUpdated", _live.GetSnapshot(room));
        }

        public async Task LeaveRoom(string roomCode)
        {
            if (!_live.TryGetRoom(roomCode, out var room)) return;

            _live.RemoveParticipant(room, Context.ConnectionId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomCode);
            await Clients.Group(roomCode).SendAsync("UserLeft", GetUserId());
        }

        // ADMIN startuje kviz
        public async Task StartQuiz(string roomCode)
        {
            if (!_live.TryGetRoom(roomCode, out var room))
                throw new HubException("Room not found");

            if (!IsAdminOfRoom(room))
                throw new HubException("Only admin can start the quiz");

            var (q, snapshot) = await _live.StartQuizAsync(room);
            if (q == null)
            {
                await Clients.Group(roomCode).SendAsync("QuizEnded", snapshot);
            }
            else
            {
                await Clients.Group(roomCode).SendAsync("QuestionStarted", q, snapshot);
            }
        }

        // (opciono) ADMIN ručno na sledeće pitanje
        public async Task NextQuestion(string roomCode)
        {
            if (!_live.TryGetRoom(roomCode, out var room))
                throw new HubException("Room not found");

            if (!IsAdminOfRoom(room))
                throw new HubException("Only admin can go to next question");

            var (q, snapshot) = await _live.NextQuestionAsync(room);
            if (q == null)
            {
                await Clients.Group(roomCode).SendAsync("QuizEnded", snapshot);
            }
            else
            {
                await Clients.Group(roomCode).SendAsync("QuestionStarted", q, snapshot);
            }
        }

        // korisnik šalje odgovor
        public async Task SubmitAnswer(string roomCode, SubmitAnswerDTO dto)
        {
            if (!_live.TryGetRoom(roomCode, out var room))
                throw new HubException("Room not found");

            var userId = GetUserId();
            var (correct, points, snapshot) = await _live.SubmitAnswerAsync(room, userId, dto);
            await Clients.Caller.SendAsync("AnswerResult", new { correct, points });
            // LeaderboardUpdated se već šalje iz servisa
        }

        // ADMIN završava kviz pre vremena
        public async Task EndQuiz(string roomCode)
        {
            if (!_live.TryGetRoom(roomCode, out var room))
                throw new HubException("Room not found");

            if (!IsAdminOfRoom(room))
                throw new HubException("Only admin can end the quiz");

            await _live.EndQuizAsync(room);
            await Clients.Group(roomCode).SendAsync("QuizEnded", _live.GetSnapshot(room));
        }
    }
}
