using System;
using System.Collections.Generic;

namespace ApiMF.Models;

public partial class Role
{
    public short Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<EventTeamMember> EventTeamMembers { get; set; } = new List<EventTeamMember>();
}
