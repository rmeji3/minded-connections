using System.ComponentModel.DataAnnotations;
using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Dtos.Appointments;

public record UpdateAppointmentStatusRequest
{
    [Required]
    public AppointmentStatus Status { get; init; }
}
