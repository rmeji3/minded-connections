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
    public string? Notes { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("cancelled_at")]
    public DateTime? CancelledAt { get; set; }

    [Column("cancellation_reason")]
    public string? CancellationReason { get; set; }

    public TimeSlot TimeSlot { get; set; } = default!;
}
