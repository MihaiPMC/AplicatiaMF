// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/BackEnd/ApiMF/Application/Emails/Commands/CreateEmail/CreateEmailCommand.cs
using ApiMF.Data;
using ApiMF.Entities;
using ApiMF.Models.Dtos;
using MediatR;

namespace ApiMF.Application.Emails.Commands.CreateEmail;

public record CreateEmailCommand(string Subject, string? Cc, string Content) : IRequest<EmailDto>;

public class CreateEmailCommandHandler : IRequestHandler<CreateEmailCommand, EmailDto>
{
    private readonly ApplicationDbContext _db;

    public CreateEmailCommandHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<EmailDto> Handle(CreateEmailCommand request, CancellationToken cancellationToken)
    {
        var email = new Email
        {
            Subject = request.Subject.Trim(),
            Cc = string.IsNullOrWhiteSpace(request.Cc) ? null : request.Cc!.Trim(),
            Content = request.Content
        };

        _db.Emails.Add(email);
        await _db.SaveChangesAsync(cancellationToken);

        return new EmailDto
        {
            Id = email.Id,
            Subject = email.Subject,
            Cc = email.Cc,
            Content = email.Content,
            CreatedAt = email.CreatedAt
        };
    }
}

