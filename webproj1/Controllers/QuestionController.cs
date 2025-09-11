using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webproj1.Dto;
using webproj1.Interfaces;

namespace webproj1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _service;

        public QuestionController(IQuestionService service)
        {
            _service = service;
        }

        [HttpGet("quiz/{quizId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByQuiz(int quizId)
        {
            var questions = await _service.GetQuestionsByQuizId(quizId);
            return Ok(questions);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var q = await _service.GetQuestion(id);
            if (q == null) return NotFound();
            return Ok(q);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] QuestionDTO dto)
        {
            var q = await _service.CreateQuestion(dto);
            return Ok(q);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] QuestionDTO dto)
        {
            var q = await _service.UpdateQuestion(id, dto);
            if (q == null) return NotFound();
            return Ok(q);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteQuestion(id);
            if (!ok) return NotFound();
            return Ok();
        }
    }
}
