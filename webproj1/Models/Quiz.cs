namespace webproj1.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; } // npr. Programiranje, Istorija
        public string Difficulty { get; set; } // Lako, Srednje, Teško
        public int TimeLimit { get; set; } // u minutima
        public ICollection<Question> Questions { get; set; }
    }

}
