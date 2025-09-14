namespace webproj1.Dto
{
    public class CreateResultDTO
    {
        public int QuizId { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public int ScorePercent { get; set; }
        public int DurationSeconds { get; set; }
    }
}
