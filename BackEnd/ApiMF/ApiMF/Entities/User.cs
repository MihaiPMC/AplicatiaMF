using System;
using System.Collections.Generic;

namespace ApiMF.Models;

public partial class User
{
    public long Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<EventTeamMember> EventTeamMemberReportsToUsers { get; set; } = new List<EventTeamMember>();

    public virtual ICollection<EventTeamMember> EventTeamMemberUsers { get; set; } = new List<EventTeamMember>();

    public virtual ICollection<OutreachTask> OutreachTaskAssignedToUsers { get; set; } = new List<OutreachTask>();

    public virtual ICollection<OutreachTask> OutreachTaskResponsibleUsers { get; set; } = new List<OutreachTask>();
}
