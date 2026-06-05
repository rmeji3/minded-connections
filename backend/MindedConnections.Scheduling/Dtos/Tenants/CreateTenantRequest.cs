using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.Tenants;

public record CreateTenantRequest
{
    [Required, MinLength(2)]
    public string Name { get; init; } = default!;

    [Required, RegularExpression(@"^[a-z0-9-]+$", ErrorMessage = "Slug must be lowercase alphanumeric with hyphens.")]
    public string Slug { get; init; } = default!;
}
