namespace ApiMF.Models.Dtos;

public class EventDto
{
    public long Id { get; set; }
    public short EventTypeId { get; set; }
    public int Year { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
