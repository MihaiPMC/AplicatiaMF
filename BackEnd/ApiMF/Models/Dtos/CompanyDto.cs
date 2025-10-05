using System;

namespace ApiMF.Models.Dtos;

public class CompanyDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string? Notes { get; set; }
    public bool CanContactAd { get; set; }
    public bool CanContactBb { get; set; }
    public bool CanContactCa { get; set; }
    public bool CanContactMi { get; set; }
    public bool CanContactSh { get; set; }
    public bool CanContactZa { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

