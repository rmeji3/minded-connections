namespace MindedConnections.Scheduling.Dtos.BlockedSlots;

public record BlockedSlotDto(
    string Id,
    string ProviderId,
    DateTime StartsAt,
    DateTime EndsAt,
    string? Reason,
    DateTime CreatedAt
);
