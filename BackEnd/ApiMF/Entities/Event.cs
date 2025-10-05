using System;
using System.Collections.Generic;

namespace ApiMF.Entities;

public partial class Event
{
    public long Id { get; set; }

    public short EventTypeId { get; set; }

    public int Year { get; set; }

    public string Name { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public virtual ICollection<EventTeamMember> EventTeamMembers { get; set; } = new List<EventTeamMember>();

    public virtual EventType EventType { get; set; } = null!;

    public virtual ICollection<OutreachTask> OutreachTasks { get; set; } = new List<OutreachTask>();
}
