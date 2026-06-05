using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.ServiceTypes;

public record ServiceTypeDto(
    string Id,
    string Name,
    int DurationMin,
    bool IsActive,
    decimal? Price
)
{
    /// <summary>True when Price is explicitly set to 0. Null price means not yet configured.</summary>
    public bool IsFree => Price == 0m;
}

public record CreateServiceTypeRequest
{
    [Required, MinLength(2), MaxLength(100)]
    public string Name { get; init; } = default!;

    [Range(5, 480)]
    public int DurationMin { get; init; } = 60;

    /// <summary>Price in USD. Set to 0 for free services (e.g. Initial Consultation).</summary>
    [Range(0, 10000)]
    public decimal? Price { get; init; }
}
