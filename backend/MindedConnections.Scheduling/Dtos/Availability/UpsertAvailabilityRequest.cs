using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.Availability;

public record UpsertAvailabilityRequest
{
    [Required]
    public TimeOnly StartTime { get; init; }

    [Required]
    public TimeOnly EndTime { get; init; }

    [Range(15, 240)]
    public int SlotDurationMin { get; init; } = 30;

    [Range(0, 120)]
    public int BufferTimeMin { get; init; } = 0;

    [Range(1, 365)]
    public int MaxAdvanceBookingDays { get; init; } = 60;

    public bool IsActive { get; init; } = true;
}
