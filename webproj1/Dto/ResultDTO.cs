namespace webproj1.Dto
{
    public class ResultDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public int QuizId { get; set; }

        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public int ScorePercent { get; set; }
        public int DurationSeconds { get; set; }

        public DateTime TakenAt { get; set; }
    }
}
