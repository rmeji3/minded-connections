using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Scheduling.Models;

public enum NotificationType
{
    BookingConfirmation,
    CancellationNotice,
    RescheduleNotice,
    Reminder24h,
}

[Table("notification_outbox")]
public class NotificationOutbox
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("tenant_id")]
    public string TenantId { get; set; } = default!;

    [Column("appointment_id")]
    public string AppointmentId { get; set; } = default!;

    [Column("recipient_user_id")]
    public string RecipientUserId { get; set; } = default!;

    [Column("type")]
    public NotificationType Type { get; set; }

    [Column("scheduled_at")]
    public DateTime ScheduledAt { get; set; }

    [Column("sent_at")]
    public DateTime? SentAt { get; set; }

    [Column("retries")]
    public int Retries { get; set; }

    [Column("last_error")]
    [MaxLength(1000)]
    public string? LastError { get; set; }

    /// <summary>JSON-serialized NotificationPayload. Captured at queue time so worker needs no joins.</summary>
    [Column("payload_json")]
    public string PayloadJson { get; set; } = default!;
}
