using webproj1.Dto;

namespace webproj1.Interfaces
{
    public interface IResultService
    {
        Task<IEnumerable<ResultDTO>> GetResultsByQuizId(int quizId);
        Task<IEnumerable<ResultDTO>> GetResultsByUserId(int userId);
        Task<ResultDTO> GetResult(int id);
        Task<ResultDTO> CreateResult(ResultDTO dto);
        Task<bool> DeleteResult(int id);
    }
}
