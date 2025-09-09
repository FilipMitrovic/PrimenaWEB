using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using webproj1.Dto;
using webproj1.Infrastructure;
using webproj1.Interfaces;
using webproj1.Models;

namespace webproj1.Services
{
    public class UserService : IUser
    {
        private readonly IConfigurationSection _secretKey;
        private readonly DbContextt _dbContext;

        public UserService(IConfiguration config, DbContextt dbContextt)
        {
            _secretKey = config.GetSection("SecretKey");
            _dbContext = dbContextt;
        }

        public async Task<User> Register(UserDTO userDto)
        {
            if (_dbContext.Users.Any(u => u.Name == userDto.Name))
                throw new Exception("Username already exists.");
             
            if (_dbContext.Users.Any(u => u.Email == userDto.Email))
                throw new Exception("Email already exists.");

            if (string.IsNullOrWhiteSpace(userDto.Password) || userDto.Password.Length < 6)
                throw new Exception("Password must be at least 6 characters long.");

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = hashedPassword,
                Role = string.IsNullOrEmpty(userDto.Role) ? "user" : userDto.Role,
                Image = userDto.Image
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public string Login(LoginDto loginDto)
        {
            // korisnika tražimo po imenu ili emailu
            User user = _dbContext.Users
                .FirstOrDefault(u => u.Name == loginDto.Name || u.Email == loginDto.Name);

            if (user == null)
                return null;

            if (BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                List<Claim> claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("role", user.Role),
                    new Claim("email", user.Email),
                    new Claim("image", user.Image ?? "")
                };


                SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                var tokenOptions = new JwtSecurityToken(
                    issuer: "http://localhost:44398",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(20),
                    signingCredentials: signinCredentials
                );

                return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            }

            return null;
        }
    }
}
