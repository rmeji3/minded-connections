using System.ComponentModel.DataAnnotations;

namespace MindedConnections.Scheduling.Dtos.Appointments;

public record EditAppointmentRequest
{
    [AllowedValues("telehealth", "in-person")]
    public string? VisitMode { get; init; }

    [MaxLength(2000)]
    public string? Notes { get; init; }
}
