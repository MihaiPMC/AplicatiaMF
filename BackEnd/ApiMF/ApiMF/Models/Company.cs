using System;
using System.Collections.Generic;

namespace ApiMF.Models;

public partial class Company
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

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

    public virtual ICollection<CompanyCollaboration> CompanyCollaborations { get; set; } = new List<CompanyCollaboration>();

    public virtual ICollection<CompanyContact> CompanyContacts { get; set; } = new List<CompanyContact>();

    public virtual ICollection<OutreachTask> OutreachTasks { get; set; } = new List<OutreachTask>();
}
