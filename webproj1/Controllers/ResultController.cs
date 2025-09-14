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
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            var r = await _service.GetResult(id);
            if (r == null) return NotFound();

            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            // ako je obican user, sme da vidi samo svoj rezultat
            if (role == "user" && userIdClaim != null && r.UserId.ToString() != userIdClaim)
            {
                return Forbid();
            }

            return Ok(r);
        }




        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateResultDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await _service.CreateResult(dto, userId);
            return Ok(result);
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
