using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ApiMF.Data;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ApiMF.Application.Events.Queries.GetActiveEvents;

public record GetActiveEventsQuery : IRequest<IEnumerable<EventDto>>;

public class GetActiveEventsQueryHandler : IRequestHandler<GetActiveEventsQuery, IEnumerable<EventDto>>
{
    private readonly ApplicationDbContext _db;

    public GetActiveEventsQueryHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<EventDto>> Handle(GetActiveEventsQuery request, CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(System.DateTime.Today);

        return await _db.Events
            .AsNoTracking()
            .Where(e => e.EndDate > today)
            .OrderBy(e => e.StartDate)
            .Select(e => new EventDto
            {
                Id = e.Id,
                EventTypeId = e.EventTypeId,
                Year = e.Year,
                Name = e.Name,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
