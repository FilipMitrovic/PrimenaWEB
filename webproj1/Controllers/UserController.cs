using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webproj1.Dto;
using webproj1.Services;
using webproj1.Interfaces;

namespace webproj1.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUser _userService;

        public UserController(IUser userService)
        {
            this._userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var token = _userService.Login(dto);
            if (token == null)
                return Unauthorized(new { error = "Invalid username/email or password." });

            return Ok(new { token });
        }

        [HttpGet("check")]
        [Authorize(Roles = "admin")]
        public IActionResult Check()
        {
            return Ok("Admin si");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDTO dto)
        {
            try
            {
                var user = await _userService.Register(dto);
                return Ok(new { message = "User registered successfully", user.Name, user.Email });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
