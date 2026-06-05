using MindedConnections.Scheduling.Dtos.Notifications;
using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Services.Notifications;

/// <summary>
/// Stub email sender — logs notification details to the console.
/// Replace this registration in Program.cs with a real provider (SendGrid, Resend, SES, etc.)
/// when email credentials are available. See appsettings.json "Email" section for required keys.
/// </summary>
public class ConsoleEmailSender(ILogger<ConsoleEmailSender> logger) : IEmailSender
{
    public Task SendAsync(NotificationType type, NotificationPayload payload, CancellationToken ct = default)
    {
        var subject = type switch
        {
            NotificationType.BookingConfirmation => $"Your appointment is confirmed — {payload.StartsAt:f}",
            NotificationType.CancellationNotice  => $"Your appointment on {payload.StartsAt:f} has been cancelled",
            NotificationType.RescheduleNotice    => $"Your appointment has been rescheduled to {payload.StartsAt:f}",
            NotificationType.Reminder24h         => $"Reminder: appointment tomorrow at {payload.StartsAt:t}",
            _                                    => "Appointment update",
        };

        logger.LogInformation(
            "[EMAIL STUB] Type={Type} To={RecipientUserId} Subject={Subject} | Visit={VisitType} ({VisitMode}) {StartsAt:u}–{EndsAt:u} | Meeting={MeetingUrl}",
            type, payload.RecipientUserId, subject,
            payload.VisitType, payload.VisitMode,
            payload.StartsAt, payload.EndsAt,
            payload.MeetingUrl ?? "in-person");

        return Task.CompletedTask;
    }
}
