using System;
using System.Collections.Generic;

namespace ApiMF.Models;

public partial class CompanyCollaboration
{
    public long Id { get; set; }

    public long CompanyId { get; set; }

    public short? EventTypeId { get; set; }

    public int? Year { get; set; }

    public string Description { get; set; } = null!;

    public string? Outcome { get; set; }

    public decimal? Amount { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual EventType? EventType { get; set; }
}
