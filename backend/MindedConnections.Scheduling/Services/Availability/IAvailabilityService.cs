using MindedConnections.Scheduling.Dtos.Availability;

namespace MindedConnections.Scheduling.Services.Availability;

public interface IAvailabilityService
{
    Task<IReadOnlyList<AvailabilityDto>> GetByProviderAsync(string tenantId, string providerId);
    Task<AvailabilityDto> UpsertAsync(string tenantId, string providerId, DayOfWeek day, UpsertAvailabilityRequest request);
    Task<bool> DeleteAsync(string tenantId, string providerId, DayOfWeek day);
}
