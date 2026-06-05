using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MindedConnections.Scheduling.Dtos.Appointments;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Models;
using MindedConnections.Scheduling.Services.Appointments;
using MindedConnections.Shared.Constants;
using MindedConnections.Shared.Dtos;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Controllers;

[ApiController]
[Route("appointments")]
[Authorize]
public class AppointmentsController(IAppointmentService appointments, ITenantContext tenant) : ControllerBase
{
    private string CallerId => User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("sub")?.Value ?? string.Empty;

    // -------------------------------------------------------------------------
    // Book single
    // -------------------------------------------------------------------------

    [HttpPost]
    [EnableRateLimiting("booking")]
    [ProducesResponseType<AppointmentDto>(201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> Book(BookAppointmentRequest request)
    {
        try
        {
            var result = await appointments.BookAsync(tenant.TenantId, CallerId, request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (NotFoundException ex)  { return NotFound(new { error = ex.Message }); }
        catch (ConflictException ex)  { return Conflict(new { error = ex.Message }); }
        catch (ValidationException ex){ return BadRequest(new { errors = ex.Errors }); }
        catch (ForbiddenException ex) { return StatusCode(403, new { error = ex.Message }); }
    }

    // -------------------------------------------------------------------------
    // Book recurring series
    // -------------------------------------------------------------------------

    [HttpPost("recurring")]
    [EnableRateLimiting("booking")]
    [ProducesResponseType<IReadOnlyList<AppointmentDto>>(201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> BookRecurring(BookRecurringAppointmentRequest request)
    {
        try
        {
            var result = await appointments.BookRecurringAsync(tenant.TenantId, CallerId, request);
            return StatusCode(201, result);
        }
        catch (NotFoundException ex)  { return NotFound(new { error = ex.Message }); }
        catch (ConflictException ex)  { return Conflict(new { error = ex.Message }); }
        catch (ValidationException ex){ return BadRequest(new { errors = ex.Errors }); }
        catch (ForbiddenException ex) { return StatusCode(403, new { error = ex.Message }); }
    }

    // -------------------------------------------------------------------------
    // Get / list
    // -------------------------------------------------------------------------

    [HttpGet("{id}")]
    [ProducesResponseType<AppointmentDto>(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var result = await appointments.GetByIdAsync(tenant.TenantId, id);

            if (User.IsInRole(Roles.Patient)   && result.PatientId  != CallerId) return Forbid();
            if (User.IsInRole(Roles.Provider)  && result.ProviderId != CallerId) return Forbid();

            return Ok(result);
        }
        catch (NotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpGet]
    [ProducesResponseType<PagedResponse<AppointmentDto>>(200)]
    public async Task<IActionResult> List([FromQuery] AppointmentListQuery query)
    {
        if (User.IsInRole(Roles.Provider))
            query = query with { ProviderId = CallerId };
        else if (!User.IsInRole(Roles.Admin))
            query = query with { PatientId = CallerId };

        var result = await appointments.ListAsync(tenant.TenantId, query);
        return Ok(result);
    }

    // -------------------------------------------------------------------------
    // Stats
    // -------------------------------------------------------------------------

    [HttpGet("stats")]
    [Authorize(Roles = Roles.Patient)]
    [ProducesResponseType<AppointmentStatsDto>(200)]
    public async Task<IActionResult> GetStats()
    {
        var result = await appointments.GetStatsAsync(tenant.TenantId, CallerId);
        return Ok(result);
    }

    [HttpGet("provider-stats")]
    [Authorize(Roles = $"{Roles.Provider},{Roles.Admin}")]
    [ProducesResponseType<ProviderStatsDto>(200)]
    public async Task<IActionResult> GetProviderStats([FromQuery] string? providerId)
    {
        var targetId = User.IsInRole(Roles.Admin) && providerId is not null
            ? providerId
            : CallerId;

        var result = await appointments.GetProviderStatsAsync(tenant.TenantId, targetId);
        return Ok(result);
    }

    // -------------------------------------------------------------------------
    // iCal export
    // -------------------------------------------------------------------------

    [HttpGet("{id}/ical")]
    [ProducesResponseType(200)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetICal(string id)
    {
        try
        {
            var appt = await appointments.GetByIdAsync(tenant.TenantId, id);

            if (User.IsInRole(Roles.Patient)  && appt.PatientId  != CallerId) return Forbid();
            if (User.IsInRole(Roles.Provider) && appt.ProviderId != CallerId) return Forbid();

            var ical = BuildICal(appt);
            return File(Encoding.UTF8.GetBytes(ical), "text/calendar", $"appointment-{id}.ics");
        }
        catch (NotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    // -------------------------------------------------------------------------
    // Cancel
    // -------------------------------------------------------------------------

    [HttpPatch("{id}/cancel")]
    [ProducesResponseType<AppointmentDto>(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Cancel(string id, CancelAppointmentRequest request)
    {
        try
        {
            var appt = await appointments.GetByIdAsync(tenant.TenantId, id);
            if (User.IsInRole(Roles.Patient) && appt.PatientId != CallerId) return Forbid();

            var skipDeadline = !User.IsInRole(Roles.Patient);
            var result = await appointments.CancelAsync(tenant.TenantId, id, CallerId, request, skipDeadline);
            return Ok(result);
        }
        catch (NotFoundException ex)   { return NotFound(new { error = ex.Message }); }
        catch (ValidationException ex) { return BadRequest(new { errors = ex.Errors }); }
    }

    // -------------------------------------------------------------------------
    // Cancel recurring series
    // -------------------------------------------------------------------------

    [HttpPatch("recurring/{groupId}/cancel")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> CancelRecurring(string groupId)
    {
        try
        {
            var skipDeadline = !User.IsInRole(Roles.Patient);
            var count = await appointments.CancelRecurringAsync(tenant.TenantId, groupId, CallerId, skipDeadline);
            return Ok(new { cancelled = count });
        }
        catch (NotFoundException ex)   { return NotFound(new { error = ex.Message }); }
        catch (ValidationException ex) { return BadRequest(new { errors = ex.Errors }); }
    }

    // -------------------------------------------------------------------------
    // Reschedule
    // -------------------------------------------------------------------------

    [HttpPatch("{id}/reschedule")]
    [ProducesResponseType<AppointmentDto>(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> Reschedule(string id, RescheduleAppointmentRequest request)
    {
        try
        {
            var appt = await appointments.GetByIdAsync(tenant.TenantId, id);
            if (User.IsInRole(Roles.Patient) && appt.PatientId != CallerId) return Forbid();

            var skipDeadline = !User.IsInRole(Roles.Patient);
            var result = await appointments.RescheduleAsync(tenant.TenantId, id, CallerId, request, skipDeadline);
            return Ok(result);
        }
        catch (NotFoundException ex)  { return NotFound(new { error = ex.Message }); }
        catch (ConflictException ex)  { return Conflict(new { error = ex.Message }); }
        catch (ValidationException ex){ return BadRequest(new { errors = ex.Errors }); }
    }

    // -------------------------------------------------------------------------
    // Edit metadata
    // -------------------------------------------------------------------------

    [HttpPatch("{id}/edit")]
    [ProducesResponseType<AppointmentDto>(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Edit(string id, EditAppointmentRequest request)
    {
        try
        {
            var appt = await appointments.GetByIdAsync(tenant.TenantId, id);
            if (User.IsInRole(Roles.Patient) && appt.PatientId != CallerId) return Forbid();

            var result = await appointments.EditAsync(tenant.TenantId, id, CallerId, request);
            return Ok(result);
        }
        catch (NotFoundException ex)  { return NotFound(new { error = ex.Message }); }
        catch (ValidationException ex){ return BadRequest(new { errors = ex.Errors }); }
    }

    // -------------------------------------------------------------------------
    // Status update (provider / admin)
    // -------------------------------------------------------------------------

    [HttpPatch("{id}/status")]
    [Authorize(Roles = $"{Roles.Provider},{Roles.Admin}")]
    [ProducesResponseType<AppointmentDto>(200)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateStatus(string id, UpdateAppointmentStatusRequest request)
    {
        try
        {
            var result = await appointments.UpdateStatusAsync(
                tenant.TenantId, id, CallerId, User.IsInRole(Roles.Admin), request);
            return Ok(result);
        }
        catch (NotFoundException ex)  { return NotFound(new { error = ex.Message }); }
        catch (ForbiddenException ex) { return StatusCode(403, new { error = ex.Message }); }
    }

    // -------------------------------------------------------------------------
    // iCal builder
    // -------------------------------------------------------------------------

    private static string BuildICal(AppointmentDto appt)
    {
        var now = DateTime.UtcNow.ToString("yyyyMMddTHHmmssZ");
        var start = appt.StartsAt.ToString("yyyyMMddTHHmmssZ");
        var end   = appt.EndsAt.ToString("yyyyMMddTHHmmssZ");
        var description = appt.VisitMode == "telehealth" && appt.MeetingUrl is not null
            ? $"Join at: {appt.MeetingUrl}"
            : "In-person appointment";
        var location = appt.VisitMode == "telehealth"
            ? appt.MeetingUrl ?? "Online"
            : "Provider office";

        return $"""
            BEGIN:VCALENDAR
            VERSION:2.0
            PRODID:-//MindedConnections//Scheduling//EN
            CALSCALE:GREGORIAN
            METHOD:PUBLISH
            BEGIN:VEVENT
            UID:{appt.Id}@mindedconnections.com
            DTSTAMP:{now}
            DTSTART:{start}
            DTEND:{end}
            SUMMARY:{appt.VisitType}
            DESCRIPTION:{description}
            LOCATION:{location}
            STATUS:CONFIRMED
            END:VEVENT
            END:VCALENDAR
            """.ReplaceLineEndings("\r\n");
    }
}
