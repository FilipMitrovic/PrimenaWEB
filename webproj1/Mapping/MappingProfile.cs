using AutoMapper;
using webproj1.Dto;
using webproj1.Models;
namespace webproj1.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>().ReverseMap(); //Kazemo mu da mapira Subject na SubjectDto i obrnuto
            CreateMap<Login, LoginDto>().ReverseMap();

            CreateMap<Quiz, QuizDTO>().ReverseMap();
            CreateMap<Question, QuestionDTO>().ReverseMap();
            CreateMap<Option, OptionDTO>().ReverseMap();
            CreateMap<Result, ResultDTO>().ReverseMap();

        }
    }
}
