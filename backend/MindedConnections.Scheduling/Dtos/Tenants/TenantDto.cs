namespace MindedConnections.Scheduling.Dtos.Tenants;

public record TenantDto(string Id, string Name, string Slug, bool IsActive, DateTime CreatedAt);
