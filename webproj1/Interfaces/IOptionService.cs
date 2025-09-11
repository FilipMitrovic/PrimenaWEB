using webproj1.Dto;

namespace webproj1.Interfaces
{
    public interface IOptionService
    {
        Task<IEnumerable<OptionDTO>> GetOptionsByQuestionId(int questionId);
        Task<OptionDTO> GetOption(int id);
        Task<OptionDTO> CreateOption(OptionDTO dto);
        Task<OptionDTO> UpdateOption(int id, OptionDTO dto);
        Task<bool> DeleteOption(int id);
    }
}
