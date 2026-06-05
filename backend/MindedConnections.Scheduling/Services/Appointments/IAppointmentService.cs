using MindedConnections.Scheduling.Dtos.Appointments;
using MindedConnections.Scheduling.Models;
using MindedConnections.Shared.Dtos;

namespace MindedConnections.Scheduling.Services.Appointments;

public interface IAppointmentService
{
    Task<AppointmentDto> BookAsync(string tenantId, string patientId, BookAppointmentRequest request);
    Task<AppointmentDto> GetByIdAsync(string tenantId, string appointmentId);
    Task<PagedResponse<AppointmentDto>> ListAsync(string tenantId, AppointmentListQuery query);
    Task<AppointmentDto> CancelAsync(string tenantId, string appointmentId, string requesterId, CancelAppointmentRequest request);
    Task<AppointmentDto> RescheduleAsync(string tenantId, string appointmentId, string requesterId, RescheduleAppointmentRequest request);
    Task<AppointmentDto> UpdateStatusAsync(string tenantId, string appointmentId, UpdateAppointmentStatusRequest request);
}
