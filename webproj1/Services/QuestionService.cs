using AutoMapper;
using Microsoft.EntityFrameworkCore;
using webproj1.Dto;
using webproj1.Infrastructure;
using webproj1.Interfaces;
using webproj1.Models;

namespace webproj1.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly DbContextt _db;
        private readonly IMapper _mapper;

        public QuestionService(DbContextt db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<IEnumerable<QuestionDTO>> GetQuestionsByQuizId(int quizId)
        {
            var questions = await _db.Questions
                                     .Include(q => q.Options)
                                     .Where(q => q.QuizId == quizId)
                                     .ToListAsync();
            return _mapper.Map<IEnumerable<QuestionDTO>>(questions);
        }

        public async Task<QuestionDTO> GetQuestion(int id)
        {
            var question = await _db.Questions.Include(q => q.Options)
                                              .FirstOrDefaultAsync(q => q.Id == id);
            return _mapper.Map<QuestionDTO>(question);
        }

        public async Task<QuestionDTO> CreateQuestion(QuestionDTO dto)
        {
            var question = _mapper.Map<Question>(dto);
            _db.Questions.Add(question);
            await _db.SaveChangesAsync();
            return _mapper.Map<QuestionDTO>(question);
        }

        public async Task<QuestionDTO> UpdateQuestion(int id, QuestionDTO dto)
        {
            var question = await _db.Questions.Include(q => q.Options).FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) return null;

            _mapper.Map(dto, question);
            await _db.SaveChangesAsync();
            return _mapper.Map<QuestionDTO>(question);
        }

        public async Task<bool> DeleteQuestion(int id)
        {
            var question = await _db.Questions.FindAsync(id);
            if (question == null) return false;

            _db.Questions.Remove(question);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
