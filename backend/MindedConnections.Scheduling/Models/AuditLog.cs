using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Scheduling.Models;

[Table("audit_logs")]
public class AuditLog
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("tenant_id")]
    public string TenantId { get; set; } = default!;

    [Column("actor_id")]
    public string ActorId { get; set; } = default!;

    [Column("actor_role")]
    [MaxLength(50)]
    public string ActorRole { get; set; } = default!;

    /// <summary>Domain entity type: "Appointment", "Availability", "Tenant", etc.</summary>
    [Column("entity_type")]
    [MaxLength(50)]
    public string EntityType { get; set; } = default!;

    [Column("entity_id")]
    public string EntityId { get; set; } = default!;

    /// <summary>Verb describing the action: "Booked", "Cancelled", "Rescheduled", "StatusUpdated", etc.</summary>
    [Column("action")]
    [MaxLength(50)]
    public string Action { get; set; } = default!;

    [Column("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>JSON blob with action-specific context (old/new values, reasons, etc.).</summary>
    [Column("metadata")]
    public string? Metadata { get; set; }
}
