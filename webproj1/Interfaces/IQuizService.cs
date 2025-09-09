using webproj1.Dto;

namespace webproj1.Interfaces
{
    public interface IQuizService
    {
        Task<List<QuizDTO>> GetAllQuizzes();
        Task<QuizDTO> GetQuizById(int id);
        Task<QuizDTO> CreateQuiz(QuizDTO dto); // admin
        Task<QuizDTO> UpdateQuiz(int id, QuizDTO dto); // admin
        Task<bool> DeleteQuiz(int id); // admin
    }
}
