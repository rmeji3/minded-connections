using MindedConnections.Scheduling.Dtos.Slots;

namespace MindedConnections.Scheduling.Services.Slots;

public interface ISlotService
{
    /// <summary>
    /// Returns available (unbooked) slots for a provider within the requested date range,
    /// capped by each availability rule's MaxAdvanceBookingDays.
    /// </summary>
    Task<IReadOnlyList<SlotDto>> GetAvailableAsync(string tenantId, string providerId, DateTime from, DateTime to);
}
