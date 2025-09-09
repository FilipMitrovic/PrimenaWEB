using webproj1.Models;

namespace webproj1.Dto
{
    public class OptionDTO
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; } // navigaciona property
    }

}
