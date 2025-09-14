namespace webproj1.Dto
{
    public class ResultDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public string? UserName { get; set; }   // novo

        public int QuizId { get; set; }
        public string? QuizTitle { get; set; }  // novo

        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public int ScorePercent { get; set; }
        public int DurationSeconds { get; set; }

        public DateTime TakenAt { get; set; }

        public Dictionary<int, string>? Answers { get; set; }
    }
}
