using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Scheduling.Dtos.CareRelationships;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Services.CareRelationships;
using MindedConnections.Shared.Constants;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Controllers;

[ApiController]
[Route("care-relationships")]
[Authorize]
public class CareRelationshipsController(ICareRelationshipService service, ITenantContext tenant) : ControllerBase
{
    private string CallerId => User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("sub")?.Value ?? string.Empty;

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<CareRelationshipDto>>(200)]
    public async Task<IActionResult> List([FromQuery] string? patientId, [FromQuery] string? providerId)
    {
        // Providers see only their own patients; patients see only their own providers.
        if (User.IsInRole(Roles.Provider))  providerId = CallerId;
        else if (User.IsInRole(Roles.Patient)) patientId = CallerId;

        var result = await service.ListAsync(tenant.TenantId, patientId, providerId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = $"{Roles.Admin}")]
    [ProducesResponseType<CareRelationshipDto>(201)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> Assign(AssignCareRelationshipRequest request)
    {
        try
        {
            var result = await service.AssignAsync(tenant.TenantId, request);
            return CreatedAtAction(nameof(List), result);
        }
        catch (ConflictException ex) { return Conflict(new { error = ex.Message }); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = $"{Roles.Admin}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Deactivate(string id)
    {
        var found = await service.DeactivateAsync(tenant.TenantId, id);
        return found ? NoContent() : NotFound();
    }
}
