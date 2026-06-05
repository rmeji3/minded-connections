using MindedConnections.Scheduling.Dtos.CareRelationships;

namespace MindedConnections.Scheduling.Services.CareRelationships;

public interface ICareRelationshipService
{
    /// <summary>Returns true if an active relationship exists between the patient and provider.</summary>
    Task<bool> ExistsAsync(string tenantId, string patientId, string providerId);

    Task<IReadOnlyList<CareRelationshipDto>> ListAsync(string tenantId, string? patientId, string? providerId);

    Task<CareRelationshipDto> AssignAsync(string tenantId, AssignCareRelationshipRequest request);

    /// <summary>Auto-creates a care relationship after a patient's first appointment is booked.</summary>
    Task EnsureAsync(string tenantId, string patientId, string providerId);

    Task<bool> DeactivateAsync(string tenantId, string id);
}
