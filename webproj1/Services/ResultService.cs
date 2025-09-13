using AutoMapper;
using Microsoft.EntityFrameworkCore;
using webproj1.Dto;
using webproj1.Infrastructure;
using webproj1.Interfaces;
using webproj1.Models;

namespace webproj1.Services
{
    public class ResultService : IResultService
    {
        private readonly DbContextt _context;
        private readonly IMapper _mapper;

        public ResultService(DbContextt context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ResultDTO>> GetResultsByQuizId(int quizId)
        {
            var results = await _context.Results
                .Where(r => r.QuizId == quizId)
                .ToListAsync();
            return _mapper.Map<IEnumerable<ResultDTO>>(results);
        }

        public async Task<IEnumerable<ResultDTO>> GetResultsByUserId(int userId)
        {
            var results = await _context.Results
                .Where(r => r.UserId == userId)
                .ToListAsync();
            return _mapper.Map<IEnumerable<ResultDTO>>(results);
        }

        public async Task<ResultDTO> GetResult(int id)
        {
            var result = await _context.Results.FindAsync(id);
            return _mapper.Map<ResultDTO>(result);
        }

        public async Task<ResultDTO> CreateResult(ResultDTO dto)
        {
            var entity = _mapper.Map<Result>(dto);
            entity.TakenAt = DateTime.UtcNow; // automatski setujemo datum
            _context.Results.Add(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResultDTO>(entity);
        }

        public async Task<bool> DeleteResult(int id)
        {
            var result = await _context.Results.FindAsync(id);
            if (result == null) return false;
            _context.Results.Remove(result);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
