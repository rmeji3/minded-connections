using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Api.Models;

public enum AppointmentStatus { Scheduled, Completed, Cancelled }
public enum VisitMode { Telehealth, InPerson }

[Table("appointments")]
public class Appointment
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("patient_id")]
    public string PatientId { get; set; } = default!;

    [Column("provider_id")]
    public string ProviderId { get; set; } = default!;

    [Column("type_id")]
    public string TypeId { get; set; } = default!;

    [Column("scheduled_at")]
    public DateTime ScheduledAt { get; set; }

    [Column("ends_at")]
    public DateTime EndsAt { get; set; }

    [Column("mode")]
    public VisitMode Mode { get; set; }

    [Column("status")]
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

    [Column("location")]
    public string? Location { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ApplicationUser  Patient  { get; set; } = default!;
    public ProviderProfile  Provider { get; set; } = default!;
    public AppointmentType  Type     { get; set; } = default!;
}
