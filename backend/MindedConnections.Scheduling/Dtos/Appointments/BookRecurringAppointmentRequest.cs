using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.Appointments;

public record BookRecurringAppointmentRequest
{
    /// <summary>Ordered list of slot IDs to book as a series (min 2, max 52).</summary>
    [Required]
    [MinLength(2)]
    [MaxLength(52)]
    public List<string> SlotIds { get; init; } = [];

    [MaxLength(2000)]
    public string? Notes { get; init; }

    [Required]
    [MaxLength(50)]
    public string VisitType { get; init; } = default!;

    [Required]
    [AllowedValues("telehealth", "in-person")]
    public string VisitMode { get; init; } = default!;
}
