// Interfaces/ILiveQuizService.cs
using webproj1.Models.Live;
using webproj1.Dto;          // koristiš postojeći QuestionDTO/OptionDTO
using webproj1.Dto;          // QuizDTO
using webproj1.Dto;          // ResultDTO (ako bude trebalo)
using webproj1.Dto;          // CreateResultDTO (ako bude trebalo)

namespace webproj1.Interfaces
{
    public interface ILiveQuizService
    {
        // sobe
        LiveRoom CreateRoom(int quizId, string adminUserId, int questionTimeSec = 30);
        bool TryGetRoom(string roomCode, out LiveRoom room);
        bool RemoveRoom(string roomCode);

        // učesnici
        void AddParticipant(LiveRoom room, LiveParticipant p);
        void RemoveParticipant(LiveRoom room, string connectionId);

        // tok kviza
        Task<(QuestionDTO? question, RoomSnapshotDTO snapshot)> StartQuizAsync(LiveRoom room);
        Task<(QuestionDTO? question, RoomSnapshotDTO snapshot)> NextQuestionAsync(LiveRoom room);
        RoomSnapshotDTO GetSnapshot(LiveRoom room);
        Task EndQuizAsync(LiveRoom room);

        // obrada odgovora (računa i bonus)
        Task<(bool correct, int pointsAwarded, RoomSnapshotDTO snapshot)> SubmitAnswerAsync(
            LiveRoom room, string userId, SubmitAnswerDTO dto);

        // pomoćno
        Task<List<QuestionDTO>> LoadQuestionsAsync(int quizId);
        int ScoreFor(bool isCorrect, int elapsedMs, int questionTimeSec);
        bool IsAnswerCorrect(QuestionDTO question, SubmitAnswerDTO dto);
    }
}
