using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Scheduling.Models;

public enum AppointmentStatus { Scheduled, Cancelled, Completed, NoShow }

[Table("appointments")]
public class Appointment
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("tenant_id")]
    public string TenantId { get; set; } = default!;

    [Column("provider_id")]
    public string ProviderId { get; set; } = default!;

    /// <summary>References ApplicationUser.Id from the main API.</summary>
    [Column("patient_id")]
    public string PatientId { get; set; } = default!;

    [Column("time_slot_id")]
    public string TimeSlotId { get; set; } = default!;

    [Column("status")]
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

    [Column("notes")]
    [MaxLength(2000)]
    public string? Notes { get; set; }

    [Column("visit_type")]
    [MaxLength(50)]
    public string VisitType { get; set; } = "Therapy Session";

    [Column("visit_mode")]
    [MaxLength(50)]
    public string VisitMode { get; set; } = "telehealth";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("cancelled_at")]
    public DateTime? CancelledAt { get; set; }

    [Column("cancellation_reason")]
    public string? CancellationReason { get; set; }

    /// <summary>Jitsi Meet room URL. Null for in-person appointments or cancelled appointments.</summary>
    [Column("meeting_url")]
    public string? MeetingUrl { get; set; }

    /// <summary>Number of times this appointment has been rescheduled.</summary>
    [Column("reschedule_count")]
    public int RescheduleCount { get; set; }

    /// <summary>Non-null when this appointment belongs to a recurring series.</summary>
    [Column("recurrence_group_id")]
    public string? RecurrenceGroupId { get; set; }

    public TimeSlot TimeSlot { get; set; } = default!;
}
