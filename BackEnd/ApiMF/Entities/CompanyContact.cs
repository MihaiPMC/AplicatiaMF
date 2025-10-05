using System;
using System.Collections.Generic;
using ApiMF.Entities;

namespace ApiMF.Models;

public partial class CompanyContact
{
    public long Id { get; set; }

    public long CompanyId { get; set; }

    public short ContactTypeId { get; set; }

    public string Value { get; set; } = null!;

    public string? PersonName { get; set; }

    public string? Position { get; set; }

    public bool IsPrimary { get; set; }

    public string ExtraInfo { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual ContactType ContactType { get; set; } = null!;

    public virtual ICollection<OutreachTask> OutreachTasks { get; set; } = new List<OutreachTask>();
}
