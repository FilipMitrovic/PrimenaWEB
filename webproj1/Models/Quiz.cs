namespace webproj1.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; } 
        public string Difficulty { get; set; } 
        public int TimeLimit { get; set; } 
        public ICollection<Question> Questions { get; set; }
    }

}
