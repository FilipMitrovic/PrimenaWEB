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
                .Include(r => r.User)
                .Include(r => r.Quiz)
                .Where(r => r.QuizId == quizId)
                .ToListAsync();

            return results.Select(r => new ResultDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User?.Name,
                QuizId = r.QuizId,
                QuizTitle = r.Quiz?.Title,
                CorrectAnswers = r.CorrectAnswers,
                TotalQuestions = r.TotalQuestions,
                ScorePercent = r.ScorePercent,
                DurationSeconds = r.DurationSeconds,
                TakenAt = r.TakenAt
            });
        }

        public async Task<IEnumerable<ResultDTO>> GetResultsByUserId(int userId)
        {
            var results = await _context.Results
                .Include(r => r.User)
                .Include(r => r.Quiz)
                .Where(r => r.UserId == userId)
                .ToListAsync();

            return results.Select(r => new ResultDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User?.Name,
                QuizId = r.QuizId,
                QuizTitle = r.Quiz?.Title,
                CorrectAnswers = r.CorrectAnswers,
                TotalQuestions = r.TotalQuestions,
                ScorePercent = r.ScorePercent,
                DurationSeconds = r.DurationSeconds,
                TakenAt = r.TakenAt
            });
        }

        public async Task<ResultDTO?> GetResult(int id)
        {
            var r = await _context.Results
                .Include(x => x.User)
                .Include(x => x.Quiz)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (r == null) return null;

            return new ResultDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User?.Name,
                QuizId = r.QuizId,
                QuizTitle = r.Quiz?.Title,
                CorrectAnswers = r.CorrectAnswers,
                TotalQuestions = r.TotalQuestions,
                ScorePercent = r.ScorePercent,
                DurationSeconds = r.DurationSeconds,
                TakenAt = r.TakenAt
            };
        }

        public async Task<ResultDTO> CreateResult(CreateResultDTO dto, int userId)
        {
            var entity = new Result
            {
                QuizId = dto.QuizId,
                UserId = userId, // iz tokena
                CorrectAnswers = dto.CorrectAnswers,
                TotalQuestions = dto.TotalQuestions,
                ScorePercent = dto.ScorePercent,
                DurationSeconds = dto.DurationSeconds,
                TakenAt = DateTime.UtcNow
            };

            _context.Results.Add(entity);
            await _context.SaveChangesAsync();

            // vrati sa UserName i QuizTitle
            return new ResultDTO
            {
                Id = entity.Id,
                QuizId = entity.QuizId,
                UserId = entity.UserId,
                CorrectAnswers = entity.CorrectAnswers,
                TotalQuestions = entity.TotalQuestions,
                ScorePercent = entity.ScorePercent,
                DurationSeconds = entity.DurationSeconds,
                TakenAt = entity.TakenAt,
                UserName = entity.User?.Name,
                QuizTitle = entity.Quiz?.Title
            };
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
