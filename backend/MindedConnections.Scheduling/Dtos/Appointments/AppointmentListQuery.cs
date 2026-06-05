using MindedConnections.Scheduling.Models;
using MindedConnections.Shared.Queries;

namespace MindedConnections.Scheduling.Dtos.Appointments;

public record AppointmentListQuery : PaginatedQuery
{
    public string? ProviderId { get; init; }
    public string? PatientId  { get; init; }
    public AppointmentStatus? Status { get; init; }
    public DateTime? From { get; init; }
    public DateTime? To   { get; init; }
}
