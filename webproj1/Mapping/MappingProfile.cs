using AutoMapper;
using webproj1.Dto;
using webproj1.Models;
namespace webproj1.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>().ReverseMap(); 
            CreateMap<Login, LoginDto>().ReverseMap();

            CreateMap<Quiz, QuizDTO>().ReverseMap();
            CreateMap<Question, QuestionDTO>().ReverseMap();
            CreateMap<Option, OptionDTO>().ReverseMap();
            CreateMap<Result, ResultDTO>()
               .ForMember(dest => dest.UserName,
                          opt => opt.MapFrom(src => src.User != null ? src.User.Name : null))
               .ForMember(dest => dest.QuizTitle,
                          opt => opt.MapFrom(src => src.Quiz != null ? src.Quiz.Title : null))
               .ReverseMap();

        }
    }
}
