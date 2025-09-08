using webproj1.Dto;
using webproj1.Models;

namespace webproj1.Interfaces
{
    public interface IUser
    {
        string Login(LoginDto userDto);
        Task<User> Register(UserDTO userDto);
    }
}
