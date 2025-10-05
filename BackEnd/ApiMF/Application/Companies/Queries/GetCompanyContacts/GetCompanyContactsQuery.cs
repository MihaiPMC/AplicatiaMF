using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ApiMF.Data;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ApiMF.Application.Companies.Queries.GetCompanyContacts;

public record GetCompanyContactsQuery(long CompanyId) : IRequest<IEnumerable<CompanyContactDto>>;

public class GetCompanyContactsQueryHandler : IRequestHandler<GetCompanyContactsQuery, IEnumerable<CompanyContactDto>>
{
    private readonly ApplicationDbContext _db;

    public GetCompanyContactsQueryHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<CompanyContactDto>> Handle(GetCompanyContactsQuery request, CancellationToken cancellationToken)
    {
        return await _db.CompanyContacts
            .AsNoTracking()
            .Where(cc => cc.CompanyId == request.CompanyId)
            .OrderByDescending(cc => cc.IsPrimary)
            .ThenBy(cc => cc.PersonName)
            .ThenBy(cc => cc.ContactTypeId)
            .ThenBy(cc => cc.Value)
            .Select(cc => new CompanyContactDto
            {
                Id = cc.Id,
                CompanyId = cc.CompanyId,
                ContactTypeId = cc.ContactTypeId,
                ContactTypeCode = cc.ContactType.Code,
                ContactTypeName = cc.ContactType.Name,
                Value = cc.Value,
                PersonName = cc.PersonName,
                Position = cc.Position,
                IsPrimary = cc.IsPrimary,
                ExtraInfo = cc.ExtraInfo,
                CreatedAt = cc.CreatedAt,
                UpdatedAt = cc.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}

