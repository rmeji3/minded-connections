namespace MindedConnections.Scheduling.Dtos.Availability;

public record AvailabilityDto(
    string Id,
    string ProviderId,
    DayOfWeek DayOfWeek,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int SlotDurationMin,
    int BufferTimeMin,
    int MaxAdvanceBookingDays,
    bool IsActive
);
