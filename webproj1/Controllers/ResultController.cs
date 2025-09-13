using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using webproj1.Dto;
using webproj1.Interfaces;

namespace webproj1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResultController : ControllerBase
    {
        private readonly IResultService _service;

        public ResultController(IResultService service)
        {
            _service = service;
        }

        [HttpGet("quiz/{quizId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByQuiz(int quizId)
        {
            var results = await _service.GetResultsByQuizId(quizId);
            return Ok(results);
        }

      
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyResults()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Invalid token");

            int userId = int.Parse(userIdClaim.Value);
            var results = await _service.GetResultsByUserId(userId);
            return Ok(results);
        }

   
        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Get(int id)
        {
            var r = await _service.GetResult(id);
            if (r == null) return NotFound();
            return Ok(r);
        }

 
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ResultDTO dto)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized("Invalid token");

            dto.UserId = int.Parse(userIdClaim.Value);

            var r = await _service.CreateResult(dto);
            return Ok(r);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteResult(id);
            if (!ok) return NotFound();
            return Ok();
        }
    }
}
