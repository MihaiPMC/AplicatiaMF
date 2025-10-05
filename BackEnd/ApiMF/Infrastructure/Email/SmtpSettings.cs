// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/BackEnd/ApiMF/Infrastructure/Email/SmtpSettings.cs
namespace ApiMF.Infrastructure.Email;

public class SmtpSettings
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public bool UseSsl { get; set; } = false;
    public bool UseStartTls { get; set; } = true;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; // Consider using user secrets or env vars
    public string FromAddress { get; set; } = string.Empty;
    public string? FromName { get; set; }
}

