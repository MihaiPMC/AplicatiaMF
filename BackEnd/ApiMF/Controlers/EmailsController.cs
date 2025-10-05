// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/BackEnd/ApiMF/Controlers/EmailsController.cs

using System.ComponentModel.DataAnnotations;
using ApiMF.Application.Emails.Commands.CreateEmail;
using ApiMF.Application.Emails.Commands.SendEmail;
using ApiMF.Application.Emails.Queries.GetEmailById;
using ApiMF.Application.Emails.Queries.GetEmails;
using ApiMF.Models.Dtos;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ApiMF.Controlers;

[ApiController]
[Route("api/[controller]")]
public class EmailsController : ControllerBase
{
    private readonly IMediator _mediator;

    public EmailsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/emails
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EmailDto>>> GetEmails()
    {
        var result = await _mediator.Send(new GetEmailsQuery());
        return Ok(result);
    }

    // GET: api/emails/{id}
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EmailDto>> GetEmailById(long id)
    {
        var email = await _mediator.Send(new GetEmailByIdQuery(id));
        if (email == null)
            return NotFound();
        return Ok(email);
    }

    // POST: api/emails
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<EmailDto>> CreateEmail([FromBody] CreateEmailRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Subject))
            ModelState.AddModelError(nameof(request.Subject), "Subject is required.");
        if (string.IsNullOrWhiteSpace(request.Content))
            ModelState.AddModelError(nameof(request.Content), "Content is required.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var cmd = new CreateEmailCommand(
            request.Subject,
            request.Cc,
            request.Content
        );

        var dto = await _mediator.Send(cmd);
        return CreatedAtAction(nameof(GetEmailById), new { id = dto.Id }, dto);
    }

    // POST: api/emails/send
    [HttpPost("send")]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> SendEmail([FromBody] SendEmailRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.To))
            ModelState.AddModelError(nameof(request.To), "Recipient 'to' is required.");
        if (string.IsNullOrWhiteSpace(request.Subject))
            ModelState.AddModelError(nameof(request.Subject), "Subject is required.");
        if (string.IsNullOrWhiteSpace(request.Content))
            ModelState.AddModelError(nameof(request.Content), "Content is required.");

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var cmd = new SendEmailCommand(
            To: request.To.Trim(),
            Subject: request.Subject.Trim(),
            Cc: string.IsNullOrWhiteSpace(request.Cc) ? null : request.Cc,
            HtmlContent: request.Content,
            ScheduledAt: request.ScheduledAt
        );

        await _mediator.Send(cmd, cancellationToken);
        return Accepted();
    }

    public class CreateEmailRequest
    {
        public string Subject { get; set; } = string.Empty;
        public string? Cc { get; set; }
        public string Content { get; set; } = string.Empty;
    }

    public class SendEmailRequest
    {
        [Required]
        public string To { get; set; } = string.Empty;
        [Required]
        public string Subject { get; set; } = string.Empty;
        public string? Cc { get; set; }
        [Required]
        public string Content { get; set; } = string.Empty;
        public DateTimeOffset? ScheduledAt { get; set; }
    }
}
