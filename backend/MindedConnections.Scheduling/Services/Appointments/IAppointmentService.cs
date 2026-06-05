using MindedConnections.Scheduling.Dtos.Appointments;
using MindedConnections.Scheduling.Models;
using MindedConnections.Shared.Dtos;

namespace MindedConnections.Scheduling.Services.Appointments;

public interface IAppointmentService
{
    Task<AppointmentDto> BookAsync(string tenantId, string patientId, BookAppointmentRequest request);
    Task<IReadOnlyList<AppointmentDto>> BookRecurringAsync(string tenantId, string patientId, BookRecurringAppointmentRequest request);
    Task<AppointmentDto> GetByIdAsync(string tenantId, string appointmentId);
    Task<PagedResponse<AppointmentDto>> ListAsync(string tenantId, AppointmentListQuery query);
    Task<AppointmentDto> CancelAsync(string tenantId, string appointmentId, string requesterId, CancelAppointmentRequest request, bool skipDeadline = false);
    Task<int> CancelRecurringAsync(string tenantId, string recurrenceGroupId, string requesterId, bool skipDeadline = false);
    Task<AppointmentDto> RescheduleAsync(string tenantId, string appointmentId, string requesterId, RescheduleAppointmentRequest request, bool skipDeadline = false);
    Task<AppointmentDto> EditAsync(string tenantId, string appointmentId, string requesterId, EditAppointmentRequest request);
    Task<AppointmentDto> UpdateStatusAsync(string tenantId, string appointmentId, string requesterId, bool isAdmin, UpdateAppointmentStatusRequest request);
    Task<AppointmentStatsDto> GetStatsAsync(string tenantId, string patientId);
    Task<ProviderStatsDto> GetProviderStatsAsync(string tenantId, string providerId);
}
