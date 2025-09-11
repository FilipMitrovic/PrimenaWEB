using webproj1.Dto;

namespace webproj1.Interfaces
{
    public interface IQuestionService
    {
        Task<IEnumerable<QuestionDTO>> GetQuestionsByQuizId(int quizId);
        Task<QuestionDTO> GetQuestion(int id);
        Task<QuestionDTO> CreateQuestion(QuestionDTO dto);
        Task<QuestionDTO> UpdateQuestion(int id, QuestionDTO dto);
        Task<bool> DeleteQuestion(int id);
    }
}
