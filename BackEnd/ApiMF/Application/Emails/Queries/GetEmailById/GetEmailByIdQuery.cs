// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/BackEnd/ApiMF/Application/Emails/Queries/GetEmailById/GetEmailByIdQuery.cs
using ApiMF.Data;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ApiMF.Application.Emails.Queries.GetEmailById;

public record GetEmailByIdQuery(long Id) : IRequest<EmailDto?>;

public class GetEmailByIdQueryHandler : IRequestHandler<GetEmailByIdQuery, EmailDto?>
{
    private readonly ApplicationDbContext _db;

    public GetEmailByIdQueryHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<EmailDto?> Handle(GetEmailByIdQuery request, CancellationToken cancellationToken)
    {
        var e = await _db.Emails.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (e == null) return null;
        return new EmailDto
        {
            Id = e.Id,
            Subject = e.Subject,
            Cc = e.Cc,
            Content = e.Content,
            CreatedAt = e.CreatedAt
        };
    }
}

