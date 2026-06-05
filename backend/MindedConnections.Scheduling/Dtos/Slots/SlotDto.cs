namespace MindedConnections.Scheduling.Dtos.Slots;

public record SlotDto(string Id, string ProviderId, DateTime StartsAt, DateTime EndsAt);
