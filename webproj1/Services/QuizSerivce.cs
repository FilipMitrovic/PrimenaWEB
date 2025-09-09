using webproj1.Models;
using webproj1.Dto;
using webproj1.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using webproj1.Infrastructure;

namespace webproj1.Services
{
    public class QuizService : IQuizService
    {
        private readonly DbContextt _dbContext;
        private readonly IMapper _mapper;

        public QuizService(DbContextt dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }


        public async Task<List<QuizDTO>> GetAllQuizzes()
        {
            var quizzes = await _dbContext.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(qt => qt.Options)
                .ToListAsync();

            return _mapper.Map<List<QuizDTO>>(quizzes);
        }

        public async Task<QuizDTO> GetQuizById(int id)
        {
            var quiz = await _dbContext.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(qt => qt.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            return _mapper.Map<QuizDTO>(quiz);
        }
 
        public async Task<QuizDTO> CreateQuiz(QuizDTO dto)
        {
            var quiz = _mapper.Map<Quiz>(dto);
            _dbContext.Quizzes.Add(quiz);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<QuizDTO>(quiz);
        }

        public async Task<QuizDTO> UpdateQuiz(int id, QuizDTO dto)
        {
            var existingQuiz = await _dbContext.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(qt => qt.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (existingQuiz == null) return null;

            // Mapiramo promenjene vrednosti (osim Id)
            _mapper.Map(dto, existingQuiz);

            await _dbContext.SaveChangesAsync();
            return _mapper.Map<QuizDTO>(existingQuiz);
        }

        public async Task<bool> DeleteQuiz(int id)
        {
            var quiz = await _dbContext.Quizzes.FindAsync(id);
            if (quiz == null) return false;

            _dbContext.Quizzes.Remove(quiz);
            await _dbContext.SaveChangesAsync();
            return true;
        }


    }
}
