using MindedConnections.Scheduling.Dtos.ServiceTypes;

namespace MindedConnections.Scheduling.Services.ServiceTypes;

public interface IServiceTypeService
{
    Task<IReadOnlyList<ServiceTypeDto>> ListAsync(string tenantId);
    Task<ServiceTypeDto> CreateAsync(string tenantId, CreateServiceTypeRequest request);
    Task<bool> DeactivateAsync(string tenantId, string id);
}
