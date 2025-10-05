using AutoMapper;
using ApiMF.Entities;
using ApiMF.Models.Dtos;
using ApiMF.Application.Users.Commands.CreateUser;

namespace ApiMF.Application.Users;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        // Command -> Entity (leave password hashing/normalization to handler)
        CreateMap<CreateUserCommand, User>()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.FirstName.Trim()))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.LastName.Trim()))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.Email.Trim()))
            .ForMember(d => d.PasswordHash, opt => opt.Ignore())
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.CreatedAt, opt => opt.Ignore())
            .ForMember(d => d.UpdatedAt, opt => opt.Ignore());

        // Entity -> DTO
        CreateMap<User, UserDto>();
    }
}
