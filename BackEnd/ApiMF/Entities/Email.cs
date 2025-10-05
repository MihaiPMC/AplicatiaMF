using System;
using System.Collections.Generic;

namespace ApiMF.Entities;

public partial class Email
{
    public long Id { get; set; }

    public string Subject { get; set; } = null!;

    public string? Cc { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
