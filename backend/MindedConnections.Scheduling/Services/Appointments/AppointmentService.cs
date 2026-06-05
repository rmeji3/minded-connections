using System.Data;
using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.Appointments;
using MindedConnections.Scheduling.Models;
using MindedConnections.Scheduling.Services.Audit;
using MindedConnections.Scheduling.Services.CareRelationships;
using MindedConnections.Scheduling.Services.Notifications;
using MindedConnections.Shared.Dtos;
using MindedConnections.Shared.Exceptions;
using Npgsql;

namespace MindedConnections.Scheduling.Services.Appointments;

public class AppointmentService(
    SchedulingDbContext db,
    IConfiguration config,
    IAuditService audit,
    INotificationService notifications,
    ICareRelationshipService careRelationships,
    ILogger<AppointmentService> logger) : IAppointmentService
{
    private string JitsiBase        => config["Jitsi:BaseUrl"]?.TrimEnd('/') ?? "https://meet.jit.si";
    private int    MaxReschedules   => config.GetValue<int>("Scheduling:MaxRescheduleCount", 3);

    // -------------------------------------------------------------------------
    // Book single appointment
    // -------------------------------------------------------------------------

    public async Task<AppointmentDto> BookAsync(string tenantId, string patientId, BookAppointmentRequest request)
    {
        var serviceType = await db.ServiceTypes
            .FirstOrDefaultAsync(st => st.TenantId == tenantId && st.Name == request.VisitType && st.IsActive)
            ?? throw new ValidationException([$"'{request.VisitType}' is not a valid visit type."]);

        using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.RepeatableRead);
        try
        {
            var slot = await ResolveSlotAsync(request.SlotId, tenantId)
                ?? throw new NotFoundException($"Slot '{request.SlotId}' not found.");

            ValidateSlotTiming(slot);
            await ValidateSlotAvailabilityAsync(slot);
            await ValidateNewPatientRulesAsync(tenantId, patientId, request.VisitType);
            ValidateServiceTypeDuration(serviceType, slot);
            await ValidateCareRelationshipAsync(tenantId, patientId, slot.ProviderId, request.VisitType);

            var appointment = CreateAppointment(tenantId, patientId, slot, request.Notes, request.VisitType, request.VisitMode);
            slot.Status = SlotStatus.Booked;

            db.Appointments.Add(appointment);
            await db.SaveChangesAsync();
            await tx.CommitAsync();

            // Auto-create care relationship after first booking (Initial Consultation).
            if (string.Equals(request.VisitType, "Initial Consultation", StringComparison.OrdinalIgnoreCase))
                await careRelationships.EnsureAsync(tenantId, patientId, slot.ProviderId);

            logger.LogInformation("Appointment {AppointmentId} booked by patient {PatientId}", appointment.Id, patientId);
            await audit.LogAsync(tenantId, patientId, "Patient", "Appointment", appointment.Id, "Booked",
                new { request.VisitType, request.VisitMode, SlotId = slot.Id });
            await notifications.QueueBookingConfirmationAsync(appointment, slot);

            return ToDto(appointment, slot);
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pg && pg.SqlState == "23505")
        {
            await tx.RollbackAsync();
            throw new ConflictException("This slot was just booked by someone else. Please choose another.");
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    // -------------------------------------------------------------------------
    // Book recurring series
    // -------------------------------------------------------------------------

    public async Task<IReadOnlyList<AppointmentDto>> BookRecurringAsync(
        string tenantId, string patientId, BookRecurringAppointmentRequest request)
    {
        var serviceType = await db.ServiceTypes
            .FirstOrDefaultAsync(st => st.TenantId == tenantId && st.Name == request.VisitType && st.IsActive)
            ?? throw new ValidationException([$"'{request.VisitType}' is not a valid visit type."]);

        await ValidateCareRelationshipForSeriesAsync(tenantId, patientId, request.VisitType);

        using var tx = await db.Database.BeginTransactionAsync(IsolationLevel.RepeatableRead);
        try
        {
            var recurrenceGroupId = Guid.NewGuid().ToString();
            var created = new List<(Appointment appt, TimeSlot slot)>();

            foreach (var slotId in request.SlotIds)
            {
                var slot = await ResolveSlotAsync(slotId, tenantId)
                    ?? throw new NotFoundException($"Slot '{slotId}' not found.");

                ValidateSlotTiming(slot);
                await ValidateSlotAvailabilityAsync(slot);
                ValidateServiceTypeDuration(serviceType, slot);

                var appointment = CreateAppointment(
                    tenantId, patientId, slot,
                    request.Notes, request.VisitType, request.VisitMode,
                    recurrenceGroupId);

                slot.Status = SlotStatus.Booked;
                db.Appointments.Add(appointment);
                created.Add((appointment, slot));
            }

            await db.SaveChangesAsync();
            await tx.CommitAsync();

            logger.LogInformation("Recurring series {GroupId} booked ({Count} appointments) for patient {PatientId}",
                recurrenceGroupId, created.Count, patientId);
            await audit.LogAsync(tenantId, patientId, "Patient", "RecurringSeries", recurrenceGroupId, "Booked",
                new { Count = created.Count, request.VisitType });

            foreach (var (appt, slot) in created)
                await notifications.QueueBookingConfirmationAsync(appt, slot);

            return created.Select(x => ToDto(x.appt, x.slot)).ToList();
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pg && pg.SqlState == "23505")
        {
            await tx.RollbackAsync();
            throw new ConflictException("One or more slots in the series were just booked by someone else.");
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    // -------------------------------------------------------------------------
    // Query
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Cancel single
    // -------------------------------------------------------------------------

    public async Task<AppointmentDto> CancelAsync(
        string tenantId, string appointmentId, string requesterId,
        CancelAppointmentRequest request, bool skipDeadline = false)
    {
        var appt = await db.Appointments
            .Include(a => a.TimeSlot)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.TenantId == tenantId)
            ?? throw new NotFoundException($"Appointment '{appointmentId}' not found.");

        if (appt.Status != AppointmentStatus.Scheduled)
            throw new ValidationException([$"Cannot cancel an appointment with status '{appt.Status}'."]);

        EnforceDeadline(appt.TimeSlot.StartsAt, skipDeadline, "cancelled", "CancellationDeadlineHours");

        appt.Status             = AppointmentStatus.Cancelled;
        appt.CancelledAt        = DateTime.UtcNow;
        appt.CancellationReason = request.Reason;
        appt.TimeSlot.Status    = SlotStatus.Available;
        appt.MeetingUrl         = null;

        await db.SaveChangesAsync();

        logger.LogInformation("Appointment {AppointmentId} cancelled by {RequesterId}", appointmentId, requesterId);
        await audit.LogAsync(tenantId, requesterId, ResolveRole(requesterId, appt),
            "Appointment", appointmentId, "Cancelled", new { request.Reason });
        await notifications.QueueCancellationAsync(appt, appt.TimeSlot);

        return ToDto(appt, appt.TimeSlot);
    }

    // -------------------------------------------------------------------------
    // Cancel recurring series
    // -------------------------------------------------------------------------

    public async Task<int> CancelRecurringAsync(
        string tenantId, string recurrenceGroupId, string requesterId, bool skipDeadline = false)
    {
        var future = await db.Appointments
            .Include(a => a.TimeSlot)
            .Where(a => a.TenantId == tenantId
                     && a.RecurrenceGroupId == recurrenceGroupId
                     && a.Status == AppointmentStatus.Scheduled
                     && a.TimeSlot.StartsAt > DateTime.UtcNow)
            .ToListAsync();

        if (future.Count == 0)
            throw new NotFoundException("No future scheduled appointments found for this series.");

        foreach (var appt in future)
        {
            EnforceDeadline(appt.TimeSlot.StartsAt, skipDeadline, "cancelled", "CancellationDeadlineHours");
            appt.Status          = AppointmentStatus.Cancelled;
            appt.CancelledAt     = DateTime.UtcNow;
            appt.CancellationReason = "Series cancelled";
            appt.TimeSlot.Status = SlotStatus.Available;
            appt.MeetingUrl      = null;
        }

        await db.SaveChangesAsync();

        logger.LogInformation("Recurring series {GroupId} cancelled ({Count} appointments) by {RequesterId}",
            recurrenceGroupId, future.Count, requesterId);
        await audit.LogAsync(tenantId, requesterId, "Unknown", "RecurringSeries", recurrenceGroupId, "Cancelled",
            new { Count = future.Count });

        foreach (var appt in future)
            await notifications.QueueCancellationAsync(appt, appt.TimeSlot);

        return future.Count;
    }

    // -------------------------------------------------------------------------
    // Reschedule
    // -------------------------------------------------------------------------

    public async Task<AppointmentDto> RescheduleAsync(
        string tenantId, string appointmentId, string requesterId,
        RescheduleAppointmentRequest request, bool skipDeadline = false)
    {
        var appt = await db.Appointments
            .Include(a => a.TimeSlot)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.TenantId == tenantId)
            ?? throw new NotFoundException($"Appointment '{appointmentId}' not found.");

        if (appt.Status != AppointmentStatus.Scheduled)
            throw new ValidationException([$"Cannot reschedule an appointment with status '{appt.Status}'."]);

        if (appt.RescheduleCount >= MaxReschedules)
            throw new ValidationException([$"This appointment has already been rescheduled {appt.RescheduleCount} times (max {MaxReschedules})."]);

        EnforceDeadline(appt.TimeSlot.StartsAt, skipDeadline, "rescheduled", "RescheduleDeadlineHours");

        var newSlot = await ResolveSlotAsync(request.NewSlotId, tenantId)
            ?? throw new NotFoundException($"Slot '{request.NewSlotId}' not found.");

        if (newSlot.Status != SlotStatus.Available)
            throw new ConflictException("The new slot is no longer available.");

        var prevStartsAt = appt.TimeSlot.StartsAt;
        var prevEndsAt   = appt.TimeSlot.EndsAt;

        appt.TimeSlot.Status = SlotStatus.Available;
        newSlot.Status       = SlotStatus.Booked;
        appt.TimeSlotId      = newSlot.Id;
        appt.RescheduleCount++;

        await db.SaveChangesAsync();

        logger.LogInformation("Appointment {AppointmentId} rescheduled by {RequesterId}", appointmentId, requesterId);
        await audit.LogAsync(tenantId, requesterId, ResolveRole(requesterId, appt),
            "Appointment", appointmentId, "Rescheduled",
            new { OldSlot = request.NewSlotId, NewSlot = newSlot.Id });
        await notifications.QueueRescheduleAsync(appt, newSlot, prevStartsAt, prevEndsAt);

        return ToDto(appt, newSlot);
    }

    // -------------------------------------------------------------------------
    // Edit metadata
    // -------------------------------------------------------------------------

    public async Task<AppointmentDto> EditAsync(
        string tenantId, string appointmentId, string requesterId, EditAppointmentRequest request)
    {
        var appt = await db.Appointments
            .Include(a => a.TimeSlot)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.TenantId == tenantId)
            ?? throw new NotFoundException($"Appointment '{appointmentId}' not found.");

        if (appt.Status != AppointmentStatus.Scheduled)
            throw new ValidationException([$"Cannot edit an appointment with status '{appt.Status}'."]);

        if (request.Notes is not null)
            appt.Notes = request.Notes;

        if (request.VisitMode is not null && request.VisitMode != appt.VisitMode)
        {
            appt.VisitMode = request.VisitMode;
            if (string.Equals(request.VisitMode, "telehealth", StringComparison.OrdinalIgnoreCase))
                appt.MeetingUrl ??= $"{JitsiBase}/minded-{appt.Id}";
            else
                appt.MeetingUrl = null;
        }

        await db.SaveChangesAsync();

        logger.LogInformation("Appointment {AppointmentId} edited by {RequesterId}", appointmentId, requesterId);
        await audit.LogAsync(tenantId, requesterId, ResolveRole(requesterId, appt),
            "Appointment", appointmentId, "Edited",
            new { request.Notes, request.VisitMode });

        return ToDto(appt, appt.TimeSlot);
    }

    // -------------------------------------------------------------------------
    // Status update (provider / admin)
    // -------------------------------------------------------------------------

    public async Task<AppointmentDto> UpdateStatusAsync(
        string tenantId, string appointmentId, string requesterId,
        bool isAdmin, UpdateAppointmentStatusRequest request)
    {
        var appt = await db.Appointments
            .Include(a => a.TimeSlot)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.TenantId == tenantId)
            ?? throw new NotFoundException($"Appointment '{appointmentId}' not found.");

        if (!isAdmin && appt.ProviderId != requesterId)
            throw new ForbiddenException("You do not have permission to update this appointment's status.");

        var oldStatus = appt.Status;
        appt.Status = request.Status;
        await db.SaveChangesAsync();

        logger.LogInformation("Appointment {AppointmentId} status set to {Status} by {RequesterId}",
            appointmentId, request.Status, requesterId);
        await audit.LogAsync(tenantId, requesterId, isAdmin ? "Admin" : "Provider",
            "Appointment", appointmentId, "StatusUpdated",
            new { From = oldStatus, To = request.Status });

        return ToDto(appt, appt.TimeSlot);
    }

    // -------------------------------------------------------------------------
    // Stats — patient
    // -------------------------------------------------------------------------

    public async Task<AppointmentStatsDto> GetStatsAsync(string tenantId, string patientId)
    {
        var now        = DateTime.UtcNow;
        var yearStart  = new DateTime(now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(-1);

        var baseQ = db.Appointments.Where(a => a.TenantId == tenantId && a.PatientId == patientId);

        var nextVisitAppt = await baseQ
            .Include(a => a.TimeSlot)
            .Where(a => (a.Status == AppointmentStatus.Scheduled || a.Status == AppointmentStatus.Completed)
                     && a.TimeSlot.StartsAt >= now)
            .OrderBy(a => a.TimeSlot.StartsAt)
            .FirstOrDefaultAsync();

        var noShows      = await baseQ.CountAsync(a => a.Status == AppointmentStatus.NoShow);
        var totalAttended = await baseQ.CountAsync(a =>
            a.Status == AppointmentStatus.Completed ||
            (a.Status == AppointmentStatus.Scheduled && a.TimeSlot.StartsAt < now));
        var visitsThisYear = await baseQ.CountAsync(a =>
            (a.Status == AppointmentStatus.Scheduled || a.Status == AppointmentStatus.Completed)
            && a.TimeSlot.StartsAt >= yearStart);
        var sinceLastMonth = await baseQ.CountAsync(a =>
            (a.Status == AppointmentStatus.Scheduled || a.Status == AppointmentStatus.Completed)
            && a.TimeSlot.StartsAt >= monthStart && a.TimeSlot.StartsAt < now.AddMonths(1));
        var telehealthVisits = await baseQ.CountAsync(a =>
            (a.Status == AppointmentStatus.Scheduled || a.Status == AppointmentStatus.Completed)
            && a.TimeSlot.StartsAt >= yearStart && a.VisitMode == "telehealth");
        var reschedules = await baseQ.SumAsync(a => (int?)a.RescheduleCount) ?? 0;

        var attendanceBase = totalAttended + noShows;
        var attendanceRate = attendanceBase > 0
            ? (int)Math.Round(((double)totalAttended / attendanceBase) * 100)
            : 100;

        return new AppointmentStatsDto(
            NextVisit:         nextVisitAppt is not null ? ToDto(nextVisitAppt, nextVisitAppt.TimeSlot) : null,
            VisitsThisYear:    visitsThisYear,
            SinceLastMonthCount: sinceLastMonth,
            AttendanceRate:    attendanceRate,
            NoShows:           noShows,
            Reschedules:       reschedules,
            TelehealthVisits:  telehealthVisits,
            TotalVisits:       visitsThisYear
        );
    }

    // -------------------------------------------------------------------------
    // Stats — provider
    // -------------------------------------------------------------------------

    public async Task<ProviderStatsDto> GetProviderStatsAsync(string tenantId, string providerId)
    {
        var now         = DateTime.UtcNow;
        var todayStart  = now.Date;
        var weekStart   = todayStart.AddDays(-(int)now.DayOfWeek);
        var monthStart  = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var baseQ = db.Appointments
            .Include(a => a.TimeSlot)
            .Where(a => a.TenantId == tenantId && a.ProviderId == providerId);

        var today = await baseQ.CountAsync(a =>
            a.Status == AppointmentStatus.Scheduled &&
            a.TimeSlot.StartsAt >= todayStart &&
            a.TimeSlot.StartsAt < todayStart.AddDays(1));

        var thisWeek = await baseQ.CountAsync(a =>
            a.Status == AppointmentStatus.Scheduled &&
            a.TimeSlot.StartsAt >= weekStart &&
            a.TimeSlot.StartsAt < weekStart.AddDays(7));

        var thisMonth = await baseQ.CountAsync(a =>
            (a.Status == AppointmentStatus.Scheduled || a.Status == AppointmentStatus.Completed) &&
            a.TimeSlot.StartsAt >= monthStart);

        var uniquePatients = await baseQ
            .Where(a => a.Status != AppointmentStatus.Cancelled)
            .Select(a => a.PatientId)
            .Distinct()
            .CountAsync();

        var noShowsThisMonth = await baseQ.CountAsync(a =>
            a.Status == AppointmentStatus.NoShow && a.TimeSlot.StartsAt >= monthStart);

        var attendedThisMonth = await baseQ.CountAsync(a =>
            a.Status == AppointmentStatus.Completed && a.TimeSlot.StartsAt >= monthStart);
        var attendanceBase = attendedThisMonth + noShowsThisMonth;
        var attendanceRate = attendanceBase > 0
            ? (int)Math.Round(((double)attendedThisMonth / attendanceBase) * 100)
            : 100;

        var next = await baseQ
            .Where(a => a.Status == AppointmentStatus.Scheduled && a.TimeSlot.StartsAt >= now)
            .OrderBy(a => a.TimeSlot.StartsAt)
            .FirstOrDefaultAsync();

        return new ProviderStatsDto(
            AppointmentsToday:     today,
            AppointmentsThisWeek:  thisWeek,
            AppointmentsThisMonth: thisMonth,
            UniquePatients:        uniquePatients,
            NoShowsThisMonth:      noShowsThisMonth,
            AttendanceRate:        attendanceRate,
            NextAppointment:       next is not null ? ToDto(next, next.TimeSlot) : null
        );
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private static void ValidateSlotTiming(TimeSlot slot)
    {
        if (slot.StartsAt.Date < DateTime.UtcNow.Date)
            throw new ValidationException(["Cannot book an appointment in the past."]);
    }

    private async Task ValidateSlotAvailabilityAsync(TimeSlot slot)
    {
        if (slot.Status != SlotStatus.Available)
            throw new ConflictException("This slot is no longer available.");

        var alreadyBooked = await db.Appointments.AnyAsync(a =>
            a.TimeSlotId == slot.Id && a.Status == AppointmentStatus.Scheduled);
        if (alreadyBooked)
            throw new ConflictException("This slot has already been booked.");
    }

    private async Task ValidateNewPatientRulesAsync(string tenantId, string patientId, string visitType)
    {
        var completedOrPast = await db.Appointments.CountAsync(a =>
            a.TenantId == tenantId && a.PatientId == patientId &&
            (a.Status == AppointmentStatus.Completed ||
             (a.Status == AppointmentStatus.Scheduled && a.TimeSlot.StartsAt < DateTime.UtcNow)));

        var pending = await db.Appointments.CountAsync(a =>
            a.TenantId == tenantId && a.PatientId == patientId &&
            a.Status == AppointmentStatus.Scheduled && a.TimeSlot.StartsAt >= DateTime.UtcNow);

        if (completedOrPast == 0)
        {
            if (!string.Equals(visitType, "Initial Consultation", StringComparison.OrdinalIgnoreCase))
                throw new ValidationException(["You must complete an Initial Consultation before booking other visit types."]);

            if (pending > 0)
                throw new ValidationException(["You already have an Initial Consultation scheduled. Attend it before booking again."]);
        }
    }

    private static void ValidateServiceTypeDuration(ServiceType serviceType, TimeSlot slot)
    {
        var slotDurationMin = (int)(slot.EndsAt - slot.StartsAt).TotalMinutes;
        if (slotDurationMin != serviceType.DurationMin)
            throw new ValidationException(
                [$"'{serviceType.Name}' requires a {serviceType.DurationMin}-minute slot. This slot is {slotDurationMin} minutes."]);
    }

    private async Task ValidateCareRelationshipAsync(
        string tenantId, string patientId, string providerId, string visitType)
    {
        // Initial Consultations establish the relationship — no prior check needed.
        if (string.Equals(visitType, "Initial Consultation", StringComparison.OrdinalIgnoreCase))
            return;

        var hasRelationship = await careRelationships.ExistsAsync(tenantId, patientId, providerId);
        if (!hasRelationship)
            throw new ForbiddenException("You do not have an active care relationship with this provider.");
    }

    private async Task ValidateCareRelationshipForSeriesAsync(
        string tenantId, string patientId, string visitType)
    {
        // Recurring series are for established patients — must have had an Initial Consultation.
        if (string.Equals(visitType, "Initial Consultation", StringComparison.OrdinalIgnoreCase))
            throw new ValidationException(["Initial Consultations cannot be booked as a recurring series."]);

        var hasAny = await db.CareRelationships.AnyAsync(r =>
            r.TenantId == tenantId && r.PatientId == patientId && r.IsActive);
        if (!hasAny)
            throw new ForbiddenException("You must complete an Initial Consultation before booking a recurring series.");
    }

    private void EnforceDeadline(DateTime startsAt, bool skip, string action, string configKey)
    {
        if (skip) return;
        var deadlineHours   = config.GetValue<int>($"Scheduling:{configKey}", 24);
        var hoursUntilAppt  = (startsAt - DateTime.UtcNow).TotalHours;
        if (hoursUntilAppt < deadlineHours)
            throw new ValidationException(
                [$"Appointments must be {action} at least {deadlineHours} hours in advance. " +
                 $"This appointment starts in {Math.Max(0, (int)hoursUntilAppt)} hour(s)."]);
    }

    private Appointment CreateAppointment(
        string tenantId, string patientId, TimeSlot slot,
        string? notes, string visitType, string visitMode,
        string? recurrenceGroupId = null)
    {
        var appt = new Appointment
        {
            TenantId          = tenantId,
            ProviderId        = slot.ProviderId,
            PatientId         = patientId,
            TimeSlotId        = slot.Id,
            Notes             = notes,
            VisitType         = visitType,
            VisitMode         = visitMode,
            RecurrenceGroupId = recurrenceGroupId,
        };

        if (string.Equals(visitMode, "telehealth", StringComparison.OrdinalIgnoreCase))
            appt.MeetingUrl = $"{JitsiBase}/minded-{appt.Id}";

        return appt;
    }

    private static string ResolveRole(string requesterId, Appointment appt) =>
        requesterId == appt.PatientId ? "Patient" :
        requesterId == appt.ProviderId ? "Provider" : "Admin";

    // Resolves a slot by ID, materialising a virtual slot (availabilityId:datetime) if no persisted row exists.
    private async Task<TimeSlot?> ResolveSlotAsync(string slotId, string tenantId)
    {
        var slot = await db.TimeSlots
            .Include(s => s.Availability)
            .FirstOrDefaultAsync(s => s.Id == slotId && s.TenantId == tenantId);

        if (slot is not null)
            return slot;

        var parts = slotId.Split(':', 2);
        if (parts.Length != 2 || !DateTime.TryParseExact(
                parts[1], "O", null, System.Globalization.DateTimeStyles.RoundtripKind, out var startsAt))
            return null;

        startsAt = startsAt.ToUniversalTime();
        var rule = await db.Availabilities
            .FirstOrDefaultAsync(a => a.Id == parts[0] && a.TenantId == tenantId);

        if (rule is null)
            return null;

        slot = new TimeSlot
        {
            Id             = Guid.NewGuid().ToString(),
            TenantId       = tenantId,
            AvailabilityId = rule.Id,
            ProviderId     = rule.ProviderId,
            StartsAt       = startsAt,
            EndsAt         = startsAt.AddMinutes(rule.SlotDurationMin),
            Status         = SlotStatus.Available,
            Availability   = rule,
        };
        db.TimeSlots.Add(slot);
        return slot;
    }

    private static AppointmentDto ToDto(Appointment a, TimeSlot s) => new(
        a.Id, a.ProviderId, a.PatientId, a.TimeSlotId,
        s.StartsAt, s.EndsAt,
        a.Status, a.Notes, a.CreatedAt,
        a.CancelledAt, a.CancellationReason,
        a.VisitType, a.VisitMode,
        a.MeetingUrl, a.RecurrenceGroupId
    );
}
