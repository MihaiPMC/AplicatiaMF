using System;
using System.Collections.Generic;

namespace ApiMF.Entities;

public partial class EventType
{
    public short Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<CompanyCollaboration> CompanyCollaborations { get; set; } = new List<CompanyCollaboration>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}
