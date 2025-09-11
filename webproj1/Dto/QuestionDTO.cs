namespace webproj1.Dto
{
    public class QuestionDTO
    {
        public int Id { get; set; }         
        public string Text { get; set; }
        public string Type { get; set; }     
        public int QuizId { get; set; }      
        public List<OptionDTO> Options { get; set; } = new List<OptionDTO>();
        public string Answer { get; set; }   
    }
}
