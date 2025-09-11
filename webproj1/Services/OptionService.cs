using AutoMapper;
using Microsoft.EntityFrameworkCore;
using webproj1.Dto;
using webproj1.Infrastructure;
using webproj1.Interfaces;
using webproj1.Models;

namespace webproj1.Services
{
    public class OptionService : IOptionService
    {
        private readonly DbContextt _db;
        private readonly IMapper _mapper;

        public OptionService(DbContextt db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OptionDTO>> GetOptionsByQuestionId(int questionId)
        {
            var options = await _db.Options.Where(o => o.QuestionId == questionId).ToListAsync();
            return _mapper.Map<IEnumerable<OptionDTO>>(options);
        }

        public async Task<OptionDTO> GetOption(int id)
        {
            var option = await _db.Options.FirstOrDefaultAsync(o => o.Id == id);
            return _mapper.Map<OptionDTO>(option);
        }

        public async Task<OptionDTO> CreateOption(OptionDTO dto)
        {
            var option = _mapper.Map<Option>(dto);
            _db.Options.Add(option);
            await _db.SaveChangesAsync();
            return _mapper.Map<OptionDTO>(option);
        }

        public async Task<OptionDTO> UpdateOption(int id, OptionDTO dto)
        {
            var option = await _db.Options.FirstOrDefaultAsync(o => o.Id == id);
            if (option == null) return null;

            _mapper.Map(dto, option);
            await _db.SaveChangesAsync();
            return _mapper.Map<OptionDTO>(option);
        }

        public async Task<bool> DeleteOption(int id)
        {
            var option = await _db.Options.FindAsync(id);
            if (option == null) return false;

            _db.Options.Remove(option);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
