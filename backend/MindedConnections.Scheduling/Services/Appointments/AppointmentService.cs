using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.Appointments;
using MindedConnections.Scheduling.Models;
using MindedConnections.Shared.Dtos;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Services.Appointments;

public class AppointmentService(SchedulingDbContext db, ILogger<AppointmentService> logger) : IAppointmentService
{
    public async Task<AppointmentDto> BookAsync(string tenantId, string patientId, BookAppointmentRequest request)
    {
        // Resolve or materialise the time slot.
        var slot = await db.TimeSlots
            .Include(s => s.Availability)
            .FirstOrDefaultAsync(s => s.Id == request.SlotId && s.TenantId == tenantId);

        if (slot is null)
            throw new NotFoundException($"Slot '{request.SlotId}' not found.");

        if (slot.Status != SlotStatus.Available)
            throw new ConflictException("This slot is no longer available.");

        var alreadyBooked = await db.Appointments.AnyAsync(a =>
            a.TimeSlotId == slot.Id && a.Status == AppointmentStatus.Scheduled);

        if (alreadyBooked)
            throw new ConflictException("This slot has already been booked.");

        var appointment = new Appointment
        {
            TenantId   = tenantId,
            ProviderId = slot.ProviderId,
            PatientId  = patientId,
            TimeSlotId = slot.Id,
            Notes      = request.Notes,
        };

        slot.Status = SlotStatus.Booked;

        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();

        logger.LogInformation("Appointment {AppointmentId} booked by patient {PatientId}", appointment.Id, patientId);
        return ToDto(appointment, slot);
    }

    public async Task<AppointmentDto> GetByIdAsync(string tenantId, string appointmentId)
    {
        var appt = await db.Appointments
            .Include(a => a.TimeSlot)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.TenantId == tenantId)
            ?? throw new NotFoundException($"Appointment '{appointmentId}' not found.");

        return ToDto(appt, appt.TimeSlot);
    }

    public async Task<PagedResponse<AppointmentDto>> ListAsync(string tenantId, AppointmentListQuery query)
    {
        var q = db.Appointments
            .Include(a => a.TimeSlot)
            .Where(a => a.TenantId == tenantId);

        if (query.ProviderId is not null) q = q.Where(a => a.ProviderId == query.ProviderId);
        if (query.PatientId  is not null) q = q.Where(a => a.PatientId  == query.PatientId);
        if (query.Status     is not null) q = q.Where(a => a.Status     == query.Status);
        if (query.From       is not null) q = q.Where(a => a.TimeSlot.StartsAt >= query.From);
        if (query.To         is not null) q = q.Where(a => a.TimeSlot.StartsAt <  query.To);

        var total = await q.CountAsync();
        var items = await q
            .OrderBy(a => a.TimeSlot.StartsAt)
            .Skip(query.Skip)
            .Take(query.SafePageSize)
            .ToListAsync();

        return new PagedResponse<AppointmentDto>(
            items.Select(a => ToDto(a, a.TimeSlot)).ToList(),
            total, query.SafePage, query.SafePageSize);
    }

    public async Task<AppointmentDto> CancelAsync(
        string tenantId, string appointmentId, string requesterId, CancelAppointmentRequest request)
    {
        var appt = await db.Appointments
            .Include(a => a.TimeSlot)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.TenantId == tenantId)
            ?? throw new NotFoundException($"Appointment '{appointmentId}' not found.");

        if (appt.Status != AppointmentStatus.Scheduled)
            throw new ValidationException([$"Cannot cancel an appointment with status '{appt.Status}'."]);

        appt.Status             = AppointmentStatus.Cancelled;
        appt.CancelledAt        = DateTime.UtcNow;
        appt.CancellationReason = request.Reason;
        appt.TimeSlot.Status    = SlotStatus.Available;

        await db.SaveChangesAsync();

        logger.LogInformation("Appointment {AppointmentId} cancelled by {RequesterId}", appointmentId, requesterId);
        return ToDto(appt, appt.TimeSlot);
    }

    public async Task<AppointmentDto> RescheduleAsync(
        string tenantId, string appointmentId, string requesterId, RescheduleAppointmentRequest request)
    {
        var appt = await db.Appointments
            .Include(a => a.TimeSlot)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.TenantId == tenantId)
            ?? throw new NotFoundException($"Appointment '{appointmentId}' not found.");

        if (appt.Status != AppointmentStatus.Scheduled)
            throw new ValidationException([$"Cannot reschedule an appointment with status '{appt.Status}'."]);

        var newSlot = await db.TimeSlots
            .FirstOrDefaultAsync(s => s.Id == request.NewSlotId && s.TenantId == tenantId)
            ?? throw new NotFoundException($"Slot '{request.NewSlotId}' not found.");

        if (newSlot.Status != SlotStatus.Available)
            throw new ConflictException("The new slot is no longer available.");

        // Free old slot, claim new one.
        appt.TimeSlot.Status = SlotStatus.Available;
        newSlot.Status       = SlotStatus.Booked;
        appt.TimeSlotId      = newSlot.Id;

        await db.SaveChangesAsync();

        logger.LogInformation("Appointment {AppointmentId} rescheduled by {RequesterId}", appointmentId, requesterId);
        return ToDto(appt, newSlot);
    }

    public async Task<AppointmentDto> UpdateStatusAsync(
        string tenantId, string appointmentId, UpdateAppointmentStatusRequest request)
    {
        var appt = await db.Appointments
            .Include(a => a.TimeSlot)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.TenantId == tenantId)
            ?? throw new NotFoundException($"Appointment '{appointmentId}' not found.");

        appt.Status = request.Status;
        await db.SaveChangesAsync();

        logger.LogInformation("Appointment {AppointmentId} status set to {Status}", appointmentId, request.Status);
        return ToDto(appt, appt.TimeSlot);
    }

    private static AppointmentDto ToDto(Appointment a, TimeSlot s) => new(
        a.Id, a.ProviderId, a.PatientId, a.TimeSlotId,
        s.StartsAt, s.EndsAt,
        a.Status, a.Notes, a.CreatedAt,
        a.CancelledAt, a.CancellationReason
    );
}
