using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.Appointments;

public record BookAppointmentRequest
{
    [Required]
    public string SlotId { get; init; } = default!;

    [MaxLength(1000)]
    public string? Notes { get; init; }
}
