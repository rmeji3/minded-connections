namespace MindedConnections.Scheduling.Dtos.CareRelationships;

public record CareRelationshipDto(
    string Id,
    string TenantId,
    string PatientId,
    string ProviderId,
    bool IsActive,
    DateTime CreatedAt
);
