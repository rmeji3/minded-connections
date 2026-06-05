using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.BlockedSlots;

public record BlockSlotRequest
{
    [Required]
    public DateTime StartsAt { get; init; }

    [Required]
    public DateTime EndsAt { get; init; }

    [MaxLength(500)]
    public string? Reason { get; init; }
}
