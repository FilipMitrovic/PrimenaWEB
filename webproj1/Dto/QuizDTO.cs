namespace webproj1.Dto
{
    public class QuizDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Difficulty { get; set; }
        public int TimeLimit { get; set; }

        public ICollection<QuestionDTO> Questions { get; set; }
    }

}
