using System;
using System.Collections.Generic;

namespace ApiMF.Models;

public partial class EventTeamMember
{
    public long Id { get; set; }

    public long EventId { get; set; }

    public long UserId { get; set; }

    public short RoleId { get; set; }

    public long? ReportsToUserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual User? ReportsToUser { get; set; }

    public virtual Role Role { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
