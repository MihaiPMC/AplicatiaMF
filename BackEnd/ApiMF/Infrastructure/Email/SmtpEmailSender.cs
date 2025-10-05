// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/BackEnd/ApiMF/Infrastructure/Email/SmtpEmailSender.cs
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace ApiMF.Infrastructure.Email;

public class SmtpEmailSender : IEmailSender
{
    private readonly SmtpSettings _settings;

    public SmtpEmailSender(IOptions<SmtpSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendHtmlEmailAsync(string to, string subject, string htmlBody, string? ccCsv = null, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.Host))
            throw new InvalidOperationException("SMTP Host is not configured.");
        if (string.IsNullOrWhiteSpace(_settings.FromAddress))
            throw new InvalidOperationException("SMTP FromAddress is not configured.");

        using var message = new MailMessage();
        message.From = new MailAddress(_settings.FromAddress, _settings.FromName ?? _settings.FromAddress);
        message.To.Add(new MailAddress(to));
        if (!string.IsNullOrWhiteSpace(ccCsv))
        {
            foreach (var cc in ccCsv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            {
                message.CC.Add(new MailAddress(cc));
            }
        }
        message.Subject = subject;
        message.Body = htmlBody;
        message.IsBodyHtml = true;

        using var smtpClient = new SmtpClient(_settings.Host, _settings.Port)
        {
            EnableSsl = _settings.UseSsl || _settings.UseStartTls,
            Credentials = string.IsNullOrWhiteSpace(_settings.Username)
                ? CredentialCache.DefaultNetworkCredentials
                : new NetworkCredential(_settings.Username, _settings.Password)
        };

        await smtpClient.SendMailAsync(message);
    }
}
