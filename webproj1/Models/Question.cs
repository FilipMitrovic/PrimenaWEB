namespace webproj1.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string Type { get; set; } // "single", "multiple", "truefalse", "fill"
        public ICollection<Option> Options { get; set; } // za multiple choice
        public string Answer { get; set; } // tačan odgovor ili više odgovora (JSON ili CSV)
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
    }

}
