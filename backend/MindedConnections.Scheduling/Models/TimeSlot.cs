using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Scheduling.Models;

public enum SlotStatus { Available, Booked, Blocked }

[Table("time_slots")]
public class TimeSlot
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("tenant_id")]
    public string TenantId { get; set; } = default!;

    [Column("availability_id")]
    public string AvailabilityId { get; set; } = default!;

    [Column("provider_id")]
    public string ProviderId { get; set; } = default!;

    [Column("starts_at")]
    public DateTime StartsAt { get; set; }

    [Column("ends_at")]
    public DateTime EndsAt { get; set; }

    [Column("status")]
    public SlotStatus Status { get; set; } = SlotStatus.Available;

    public Availability Availability { get; set; } = default!;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
