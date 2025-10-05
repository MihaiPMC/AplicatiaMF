using MediatR;
using Microsoft.AspNetCore.Mvc;
using ApiMF.Models.Dtos;
using ApiMF.Application.Events.Queries.GetActiveEvents;

namespace ApiMF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;

    public EventsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/events/active
    [HttpGet("active")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetActiveEvents()
    {
        var result = await _mediator.Send(new GetActiveEventsQuery());
        return Ok(result);
    }
}

