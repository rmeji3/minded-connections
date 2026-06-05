using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Scheduling.Models;

/// <summary>
/// Provider-defined unavailability window. Slots that overlap this range are hidden
/// from the public slot listing even if the recurring availability rule covers them.
/// </summary>
[Table("blocked_slots")]
public class BlockedSlot
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("tenant_id")]
    public string TenantId { get; set; } = default!;

    [Column("provider_id")]
    public string ProviderId { get; set; } = default!;

    [Column("starts_at")]
    public DateTime StartsAt { get; set; }

    [Column("ends_at")]
    public DateTime EndsAt { get; set; }

    [Column("reason")]
    [MaxLength(500)]
    public string? Reason { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
