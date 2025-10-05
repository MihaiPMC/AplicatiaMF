using ApiMF.Data;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ApiMF.Application.Users.Queries.GetUserById;

public record GetUserByIdQuery(long Id) : IRequest<UserDto?>;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto?>
{
    private readonly ApplicationDbContext _db;

    public GetUserByIdQueryHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
        if (user == null) return null;
        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
