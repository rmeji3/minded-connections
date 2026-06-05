namespace MindedConnections.Scheduling.Dtos.Tenants;

/// <summary>
/// Returned once on tenant creation. The plain-text ApiKey is never stored — save it immediately.
/// </summary>
public record CreateTenantResponse(TenantDto Tenant, string ApiKey);
