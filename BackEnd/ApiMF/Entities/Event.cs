using System;
using System.Collections.Generic;
using ApiMF.Entities;

namespace ApiMF.Models;

public partial class Event
{
    public long Id { get; set; }

    public short EventTypeId { get; set; }

    public int Year { get; set; }

    public string Name { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<EventTeamMember> EventTeamMembers { get; set; } = new List<EventTeamMember>();

    public virtual EventType EventType { get; set; } = null!;

    public virtual ICollection<OutreachTask> OutreachTasks { get; set; } = new List<OutreachTask>();
}
