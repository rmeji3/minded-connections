namespace MindedConnections.Scheduling.Dtos.Notifications;

/// <summary>
/// Captured at queue time and stored as JSON in the outbox row.
/// The worker deserializes this to build the email without hitting the DB.
/// </summary>
public record NotificationPayload(
    string AppointmentId,
    string RecipientUserId,
    string VisitType,
    string VisitMode,
    DateTime StartsAt,
    DateTime EndsAt,
    string? MeetingUrl,
    string? CancellationReason,
    /// <summary>Set only for reschedule notices — the slot the patient is moving away from.</summary>
    DateTime? PreviousStartsAt = null,
    DateTime? PreviousEndsAt = null
);
