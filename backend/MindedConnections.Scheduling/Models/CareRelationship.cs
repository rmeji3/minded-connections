using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Scheduling.Models;

/// <summary>
/// Links a patient to one or more providers within a tenant.
/// Required for non-initial-consultation bookings; auto-created after a patient's
/// first completed Initial Consultation.
/// </summary>
[Table("care_relationships")]
public class CareRelationship
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("tenant_id")]
    public string TenantId { get; set; } = default!;

    [Column("patient_id")]
    public string PatientId { get; set; } = default!;

    [Column("provider_id")]
    public string ProviderId { get; set; } = default!;

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
