using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Scheduling.Models;

[Table("service_types")]
public class ServiceType
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("tenant_id")]
    public string TenantId { get; set; } = default!;

    [Column("name")]
    [MaxLength(100)]
    public string Name { get; set; } = default!;

    [Column("duration_min")]
    public int DurationMin { get; set; } = 60;

    /// <summary>
    /// Price in USD. 0 = free, null = not yet configured.
    /// Initial Consultations are always free (price = 0).
    /// </summary>
    [Column("price", TypeName = "numeric(10,2)")]
    public decimal? Price { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
