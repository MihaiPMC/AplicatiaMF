using System;
using System.Collections.Generic;
using ApiMF.Entities;

namespace ApiMF.Models;

public partial class OutreachTask
{
    public long Id { get; set; }

    public long EventId { get; set; }

    public long CompanyId { get; set; }

    public long ContactId { get; set; }

    public long? AssignedToUserId { get; set; }

    public long? ResponsibleUserId { get; set; }

    public short StatusId { get; set; }

    public bool ReminderSent { get; set; }

    public DateTime? LastContactedAt { get; set; }

    public DateTime? ReminderSentAt { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User? AssignedToUser { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual CompanyContact Contact { get; set; } = null!;

    public virtual Event Event { get; set; } = null!;

    public virtual User? ResponsibleUser { get; set; }

    public virtual OutreachStatus Status { get; set; } = null!;
}
