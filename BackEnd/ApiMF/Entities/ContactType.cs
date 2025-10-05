using System;
using System.Collections.Generic;

namespace ApiMF.Models;

public partial class ContactType
{
    public short Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<CompanyContact> CompanyContacts { get; set; } = new List<CompanyContact>();
}
