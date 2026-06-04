using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Scheduling.Models;

[Table("availabilities")]
public class Availability
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>References ApplicationUser.Id from the main API.</summary>
    [Column("provider_id")]
    public string ProviderId { get; set; } = default!;

    [Column("day_of_week")]
    public DayOfWeek DayOfWeek { get; set; }

    [Column("start_time")]
    public TimeOnly StartTime { get; set; }

    [Column("end_time")]
    public TimeOnly EndTime { get; set; }

    [Column("slot_duration_min")]
    public int SlotDurationMin { get; set; } = 30;

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    public ICollection<TimeSlot> TimeSlots { get; set; } = [];
}
