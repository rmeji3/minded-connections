using MindedConnections.Scheduling.Dtos.Notifications;
using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Services.Notifications;

/// <summary>
/// Abstraction over the email delivery provider.
/// Swap <see cref="ConsoleEmailSender"/> for a real implementation (SendGrid, SES, Resend, etc.)
/// by registering a different implementation in Program.cs.
/// Required env vars will vary by provider — see appsettings.json for the placeholder keys.
/// </summary>
public interface IEmailSender
{
    Task SendAsync(NotificationType type, NotificationPayload payload, CancellationToken ct = default);
}
