// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/BackEnd/ApiMF/Infrastructure/Email/IEmailSender.cs
namespace ApiMF.Infrastructure.Email;

public interface IEmailSender
{
    Task SendHtmlEmailAsync(
        string to,
        string subject,
        string htmlBody,
        string? ccCsv = null,
        CancellationToken cancellationToken = default);
}

