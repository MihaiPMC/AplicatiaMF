using System.Collections.Generic;
using System.Linq;
using ApiMF.Data;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ApiMF.Application.Users.Queries.GetUsers;

public record GetUsersQuery : IRequest<IEnumerable<UserDto>>;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, IEnumerable<UserDto>>
{
    private readonly ApplicationDbContext _db;

    public GetUsersQueryHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        return await _db.Users
            .AsNoTracking()
            .Select(user => new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}