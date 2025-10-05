using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using ApiMF.Infrastructure.Email;

namespace ApiMF.Application.Emails.Commands.SendEmail;

public record SendEmailCommand(
    string To,
    string Subject,
    string? Cc,
    string HtmlContent,
    DateTimeOffset? ScheduledAt
) : IRequest<Unit>;

public class SendEmailCommandHandler : IRequestHandler<SendEmailCommand, Unit>
{
    private readonly IEmailSender _emailSender;

    public SendEmailCommandHandler(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    public async Task<Unit> Handle(SendEmailCommand request, CancellationToken cancellationToken)
    {
        // If scheduled in the future, delay until then (in-memory scheduling)
        if (request.ScheduledAt.HasValue)
        {
            var delay = request.ScheduledAt.Value - DateTimeOffset.Now;
            if (delay > TimeSpan.Zero)
            {
                _ = SendLaterAsync(delay, request, _emailSender);
                return Unit.Value;
            }
        }

        await _emailSender.SendHtmlEmailAsync(
            to: request.To,
            subject: request.Subject,
            htmlBody: request.HtmlContent,
            ccCsv: request.Cc,
            cancellationToken: cancellationToken);

        return Unit.Value;
    }

    private static async Task SendLaterAsync(TimeSpan delay, SendEmailCommand request, IEmailSender sender)
    {
        try
        {
            await Task.Delay(delay);
            await sender.SendHtmlEmailAsync(
                to: request.To,
                subject: request.Subject,
                htmlBody: request.HtmlContent,
                ccCsv: request.Cc,
                cancellationToken: CancellationToken.None);
        }
        catch
        {
            // TODO: add logging
        }
    }
}
