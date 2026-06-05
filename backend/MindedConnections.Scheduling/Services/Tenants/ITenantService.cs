using MindedConnections.Scheduling.Dtos.Tenants;

namespace MindedConnections.Scheduling.Services.Tenants;

public interface ITenantService
{
    Task<IReadOnlyList<TenantDto>> ListAsync();
    Task<CreateTenantResponse> CreateAsync(CreateTenantRequest request);
    Task<bool> DeactivateAsync(string tenantId);
}
