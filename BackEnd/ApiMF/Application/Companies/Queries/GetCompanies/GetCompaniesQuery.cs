using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ApiMF.Data;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ApiMF.Application.Companies.Queries.GetCompanies;

public record GetCompaniesQuery(
    bool? CanContactAd = null,
    bool? CanContactBb = null,
    bool? CanContactCa = null,
    bool? CanContactMi = null,
    bool? CanContactSh = null,
    bool? CanContactZa = null
) : IRequest<IEnumerable<CompanyDto>>;

public class GetCompaniesQueryHandler : IRequestHandler<GetCompaniesQuery, IEnumerable<CompanyDto>>
{
    private readonly ApplicationDbContext _db;

    public GetCompaniesQueryHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<CompanyDto>> Handle(GetCompaniesQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Companies.AsNoTracking().AsQueryable();

        if (request.CanContactAd.HasValue)
            query = query.Where(c => c.CanContactAd == request.CanContactAd.Value);
        if (request.CanContactBb.HasValue)
            query = query.Where(c => c.CanContactBb == request.CanContactBb.Value);
        if (request.CanContactCa.HasValue)
            query = query.Where(c => c.CanContactCa == request.CanContactCa.Value);
        if (request.CanContactMi.HasValue)
            query = query.Where(c => c.CanContactMi == request.CanContactMi.Value);
        if (request.CanContactSh.HasValue)
            query = query.Where(c => c.CanContactSh == request.CanContactSh.Value);
        if (request.CanContactZa.HasValue)
            query = query.Where(c => c.CanContactZa == request.CanContactZa.Value);

        return await query
            .OrderBy(c => c.Name)
            .Select(c => new CompanyDto
            {
                Id = c.Id,
                Name = c.Name,
                Website = c.Website,
                Notes = c.Notes,
                CanContactAd = c.CanContactAd,
                CanContactBb = c.CanContactBb,
                CanContactCa = c.CanContactCa,
                CanContactMi = c.CanContactMi,
                CanContactSh = c.CanContactSh,
                CanContactZa = c.CanContactZa,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
