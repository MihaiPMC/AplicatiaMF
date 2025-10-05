// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/BackEnd/ApiMF/Application/Emails/Queries/GetEmails/GetEmailsQuery.cs
using ApiMF.Data;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ApiMF.Application.Emails.Queries.GetEmails;

public record GetEmailsQuery : IRequest<IEnumerable<EmailDto>>;

public class GetEmailsQueryHandler : IRequestHandler<GetEmailsQuery, IEnumerable<EmailDto>>
{
    private readonly ApplicationDbContext _db;

    public GetEmailsQueryHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<EmailDto>> Handle(GetEmailsQuery request, CancellationToken cancellationToken)
    {
        return await _db.Emails
            .AsNoTracking()
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EmailDto
            {
                Id = e.Id,
                Subject = e.Subject,
                Cc = e.Cc,
                Content = e.Content,
                CreatedAt = e.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}

