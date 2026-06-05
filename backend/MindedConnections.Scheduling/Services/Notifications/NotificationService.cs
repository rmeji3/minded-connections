using System.Text.Json;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.Notifications;
using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Services.Notifications;

public class NotificationService(SchedulingDbContext db, ILogger<NotificationService> logger) : INotificationService
{
    public async Task QueueBookingConfirmationAsync(Appointment appt, TimeSlot slot)
    {
        var payload = BuildPayload(appt, slot);
        await QueueAsync(appt.TenantId, appt.PatientId, appt.Id, NotificationType.BookingConfirmation, DateTime.UtcNow, payload);

        // 24h reminder — only queue if the appointment is more than 24h away.
        var reminderAt = slot.StartsAt.AddHours(-24);
        if (reminderAt > DateTime.UtcNow)
            await QueueAsync(appt.TenantId, appt.PatientId, appt.Id, NotificationType.Reminder24h, reminderAt, payload);
    }

    public async Task QueueCancellationAsync(Appointment appt, TimeSlot slot)
    {
        var payload = BuildPayload(appt, slot, cancellationReason: appt.CancellationReason);
        await QueueAsync(appt.TenantId, appt.PatientId, appt.Id, NotificationType.CancellationNotice, DateTime.UtcNow, payload);
    }

    public async Task QueueRescheduleAsync(Appointment appt, TimeSlot newSlot, DateTime previousStartsAt, DateTime previousEndsAt)
    {
        var payload = BuildPayload(appt, newSlot) with
        {
            PreviousStartsAt = previousStartsAt,
            PreviousEndsAt   = previousEndsAt,
        };
        await QueueAsync(appt.TenantId, appt.PatientId, appt.Id, NotificationType.RescheduleNotice, DateTime.UtcNow, payload);
    }

    private async Task QueueAsync(
        string tenantId, string recipientUserId, string appointmentId,
        NotificationType type, DateTime scheduledAt, NotificationPayload payload)
    {
        try
        {
            db.NotificationOutbox.Add(new NotificationOutbox
            {
                TenantId        = tenantId,
                AppointmentId   = appointmentId,
                RecipientUserId = recipientUserId,
                Type            = type,
                ScheduledAt     = scheduledAt,
                PayloadJson     = JsonSerializer.Serialize(payload),
            });
            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to queue {Type} notification for appointment {AppointmentId}", type, appointmentId);
        }
    }

    private static NotificationPayload BuildPayload(
        Appointment appt, TimeSlot slot, string? cancellationReason = null) =>
        new(
            AppointmentId:      appt.Id,
            RecipientUserId:    appt.PatientId,
            VisitType:          appt.VisitType,
            VisitMode:          appt.VisitMode,
            StartsAt:           slot.StartsAt,
            EndsAt:             slot.EndsAt,
            MeetingUrl:         appt.MeetingUrl,
            CancellationReason: cancellationReason
        );
}
