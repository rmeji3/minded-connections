using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Scheduling.Dtos.Availability;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Services.Availability;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Controllers;

[ApiController]
[Route("availability")]
[Authorize]
public class AvailabilityController(IAvailabilityService availability, ITenantContext tenant) : ControllerBase
{
    [HttpGet("{providerId}")]
    [ProducesResponseType<IReadOnlyList<AvailabilityDto>>(200)]
    public async Task<IActionResult> GetByProvider(string providerId)
    {
        var result = await availability.GetByProviderAsync(tenant.TenantId, providerId);
        return Ok(result);
    }

    [HttpPut("{providerId}/{day}")]
    [Authorize(Roles = "Provider,Admin")]
    [ProducesResponseType<AvailabilityDto>(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Upsert(string providerId, DayOfWeek day, UpsertAvailabilityRequest request)
    {
        // Providers can only manage their own availability.
        if (User.IsInRole("Provider") && (User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value) != providerId)
            return Forbid();

        try
        {
            var result = await availability.UpsertAsync(tenant.TenantId, providerId, day, request);
            return Ok(result);
        }
        catch (ValidationException ex) { return BadRequest(new { errors = ex.Errors }); }
    }

    [HttpDelete("{providerId}/{day}")]
    [Authorize(Roles = "Provider,Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(string providerId, DayOfWeek day)
    {
        if (User.IsInRole("Provider") && (User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value) != providerId)
            return Forbid();

        var found = await availability.DeleteAsync(tenant.TenantId, providerId, day);
        return found ? NoContent() : NotFound();
    }
}
