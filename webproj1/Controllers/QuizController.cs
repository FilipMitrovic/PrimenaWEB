using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webproj1.Dto;
using webproj1.Interfaces;

namespace webproj1.Controllers
{
    [Route("api/quizzes")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _quizService.GetAllQuizzes());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var quiz = await _quizService.GetQuizById(id);
            if (quiz == null) return NotFound();
            return Ok(quiz);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] QuizDTO dto)
        {
            var created = await _quizService.CreateQuiz(dto);
            return Ok(created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] QuizDTO dto)
        {
            var updated = await _quizService.UpdateQuiz(id, dto);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _quizService.DeleteQuiz(id);
            if (!result) return NotFound();
            return Ok();
        }
    }

}
