using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Scheduling.Dtos.Appointments;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Models;
using MindedConnections.Scheduling.Services.Appointments;
using MindedConnections.Shared.Dtos;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Controllers;

[ApiController]
[Route("appointments")]
[Authorize]
public class AppointmentsController(IAppointmentService appointments, ITenantContext tenant) : ControllerBase
{
    private string CallerId => User.FindFirst("sub")!.Value;

    [HttpPost]
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
    }

    [HttpGet("{id}")]
    [ProducesResponseType<AppointmentDto>(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var result = await appointments.GetByIdAsync(tenant.TenantId, id);

            // Patients may only view their own appointments; providers/admins see all.
            if (User.IsInRole("Patient") && result.PatientId != CallerId)
                return Forbid();

            return Ok(result);
        }
        catch (NotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpGet]
    [Authorize(Roles = "Provider,Admin")]
    [ProducesResponseType<PagedResponse<AppointmentDto>>(200)]
    public async Task<IActionResult> List([FromQuery] AppointmentListQuery query)
    {
        // Providers can only list their own appointments.
        if (User.IsInRole("Provider"))
            query = query with { ProviderId = CallerId };

        var result = await appointments.ListAsync(tenant.TenantId, query);
        return Ok(result);
    }

    [HttpPatch("{id}/cancel")]
    [ProducesResponseType<AppointmentDto>(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Cancel(string id, CancelAppointmentRequest request)
    {
        try
        {
            var result = await appointments.CancelAsync(tenant.TenantId, id, CallerId, request);

            // Patients may only cancel their own; providers/admins cancel any.
            if (User.IsInRole("Patient") && result.PatientId != CallerId)
                return Forbid();

            return Ok(result);
        }
        catch (NotFoundException ex)   { return NotFound(new { error = ex.Message }); }
        catch (ValidationException ex) { return BadRequest(new { errors = ex.Errors }); }
    }

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
            if (User.IsInRole("Patient") && appt.PatientId != CallerId)
                return Forbid();

            var result = await appointments.RescheduleAsync(tenant.TenantId, id, CallerId, request);
            return Ok(result);
        }
        catch (NotFoundException ex)  { return NotFound(new { error = ex.Message }); }
        catch (ConflictException ex)  { return Conflict(new { error = ex.Message }); }
        catch (ValidationException ex){ return BadRequest(new { errors = ex.Errors }); }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Provider,Admin")]
    [ProducesResponseType<AppointmentDto>(200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateStatus(string id, UpdateAppointmentStatusRequest request)
    {
        try
        {
            var result = await appointments.UpdateStatusAsync(tenant.TenantId, id, request);
            return Ok(result);
        }
        catch (NotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }
}
