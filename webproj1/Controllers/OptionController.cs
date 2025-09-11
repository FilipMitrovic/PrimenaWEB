using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webproj1.Dto;
using webproj1.Interfaces;

namespace webproj1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OptionController : ControllerBase
    {
        private readonly IOptionService _service;

        public OptionController(IOptionService service)
        {
            _service = service;
        }

        [HttpGet("question/{questionId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByQuestion(int questionId)
        {
            var options = await _service.GetOptionsByQuestionId(questionId);
            return Ok(options);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var o = await _service.GetOption(id);
            if (o == null) return NotFound();
            return Ok(o);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] OptionDTO dto)
        {
            var o = await _service.CreateOption(dto);
            return Ok(o);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] OptionDTO dto)
        {
            var o = await _service.UpdateOption(id, dto);
            if (o == null) return NotFound();
            return Ok(o);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteOption(id);
            if (!ok) return NotFound();
            return Ok();
        }
    }
}
