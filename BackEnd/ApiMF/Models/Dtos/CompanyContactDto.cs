using System;

namespace ApiMF.Models.Dtos;

public class CompanyContactDto
{
    public long Id { get; set; }
    public long CompanyId { get; set; }
    public short ContactTypeId { get; set; }
    public string? ContactTypeCode { get; set; }
    public string? ContactTypeName { get; set; }
    public string Value { get; set; } = string.Empty;
    public string? PersonName { get; set; }
    public string? Position { get; set; }
    public bool IsPrimary { get; set; }
    public string ExtraInfo { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

