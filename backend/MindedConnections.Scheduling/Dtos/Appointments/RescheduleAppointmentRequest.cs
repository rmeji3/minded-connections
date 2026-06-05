using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.Appointments;

public record RescheduleAppointmentRequest
{
    [Required]
    public string NewSlotId { get; init; } = default!;
}
