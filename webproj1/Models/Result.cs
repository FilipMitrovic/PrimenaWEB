namespace webproj1.Models
{
    public class Result
    {
        public int Id { get; set; }

        // korisnik koji je rešavao
        public int UserId { get; set; }
        public User User { get; set; }

        // kviz koji je rešavan
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }

        // osnovne informacije
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public int ScorePercent { get; set; }
        public int DurationSeconds { get; set; }
        public DateTime TakenAt { get; set; } = DateTime.UtcNow;
    }
}
