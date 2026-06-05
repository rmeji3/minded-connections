using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.CareRelationships;

public record AssignCareRelationshipRequest
{
    [Required]
    public string PatientId { get; init; } = default!;

    [Required]
    public string ProviderId { get; init; } = default!;
}
