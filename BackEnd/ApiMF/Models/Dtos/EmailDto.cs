// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/BackEnd/ApiMF/Models/Dtos/EmailDto.cs
namespace ApiMF.Models.Dtos;

public class EmailDto
{
    public long Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string? Cc { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

