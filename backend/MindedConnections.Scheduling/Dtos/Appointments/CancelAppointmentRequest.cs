using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.Appointments;

public record CancelAppointmentRequest
{
    [MaxLength(500)]
    public string? Reason { get; init; }
}
