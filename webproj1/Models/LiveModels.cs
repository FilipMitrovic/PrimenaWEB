
using System.Collections.Concurrent;

namespace webproj1.Models.Live
{
    public enum LiveQuestionState
    {
        Waiting,     
        Running,     
        Finished     
    }

    public class LiveParticipant
    {
        public string ConnectionId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;
    }

    public class LiveRoom
    {
        public string RoomCode { get; set; } = string.Empty;
        public int QuizId { get; set; }
        public string AdminUserId { get; set; } = string.Empty;

        public int? TotalQuestions { get; set; }  // popunjava se pri startu
        public int CurrentQuestionIndex { get; set; } = -1;
        public DateTime? QuestionStartUtc { get; set; }
        public int QuestionTimeSec { get; set; } = 30;

        public LiveQuestionState State { get; set; } = LiveQuestionState.Waiting;
        public bool IsRunning { get; set; } = false;

        // konekcije i skorovi
        public ConcurrentDictionary<string, LiveParticipant> Participants { get; } = new();
        public ConcurrentDictionary<string, int> Scores { get; } = new(); // key = UserId

        // ko je odgovorio na trenutno pitanje (UserId)
        public ConcurrentDictionary<string, bool> AnsweredThisQuestion { get; } = new();

        // čuvamo mapu UserId -> poslednji “elapsedMs” za bonus (opciono)
        public ConcurrentDictionary<string, int> LastElapsedMs { get; } = new();
    }

    // DTO za slanje odgovora iz klijenta
    public class SubmitAnswerDTO
    {
        public int QuestionId { get; set; }
        public string? SingleOptionId { get; set; }
        public List<string>? MultipleOptionIds { get; set; }
        public string? TrueFalse { get; set; } // "true" / "false"
        public string? FillText { get; set; }
        public int ElapsedMs { get; set; } // vreme odgovora u milisekundama
    }

    // Snapshot sobe (za UI)
    public class LeaderboardRowDTO
    {
        public string UserId { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public int Score { get; set; }
    }

    public class RoomSnapshotDTO
    {
        public string RoomCode { get; set; } = string.Empty;
        public int QuizId { get; set; }
        public int CurrentQuestionIndex { get; set; }
        public int? TotalQuestions { get; set; }
        public bool IsRunning { get; set; }
        public LiveQuestionState State { get; set; }
        public int QuestionTimeSec { get; set; }
        public DateTime? QuestionStartUtc { get; set; }
        public string AdminUserId { get; set; }
        public List<LeaderboardRowDTO> Leaderboard { get; set; } = new();
    }
}
