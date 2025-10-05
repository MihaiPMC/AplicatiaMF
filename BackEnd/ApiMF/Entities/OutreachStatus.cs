using System;
using System.Collections.Generic;

namespace ApiMF.Models;

public partial class OutreachStatus
{
    public short Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<OutreachTask> OutreachTasks { get; set; } = new List<OutreachTask>();
}
