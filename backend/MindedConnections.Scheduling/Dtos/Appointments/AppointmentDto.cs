using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Dtos.Appointments;

public record AppointmentDto(
    string Id,
    string ProviderId,
    string PatientId,
    string TimeSlotId,
    DateTime StartsAt,
    DateTime EndsAt,
    AppointmentStatus Status,
    string? Notes,
    DateTime CreatedAt,
    DateTime? CancelledAt,
    string? CancellationReason,
    string VisitType,
    string VisitMode,
    string? MeetingUrl,
    string? RecurrenceGroupId
);
