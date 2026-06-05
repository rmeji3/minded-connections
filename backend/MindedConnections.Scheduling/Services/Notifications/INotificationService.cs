using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Services.Notifications;

public interface INotificationService
{
    Task QueueBookingConfirmationAsync(Appointment appt, TimeSlot slot);
    Task QueueCancellationAsync(Appointment appt, TimeSlot slot);
    Task QueueRescheduleAsync(Appointment appt, TimeSlot newSlot, DateTime previousStartsAt, DateTime previousEndsAt);
}
