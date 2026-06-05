using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Scheduling.Dtos.BlockedSlots;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Services.BlockedSlots;
using MindedConnections.Shared.Constants;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Controllers;

[ApiController]
[Route("blocked-slots")]
[Authorize(Roles = $"{Roles.Provider},{Roles.Admin}")]
public class BlockedSlotsController(IBlockedSlotService service, ITenantContext tenant) : ControllerBase
{
    private string CallerId => User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("sub")?.Value ?? string.Empty;

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<BlockedSlotDto>>(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> List(
        [FromQuery] string providerId,
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        if (string.IsNullOrWhiteSpace(providerId))
            return BadRequest(new { error = "providerId is required." });

        if (to <= from)
            return BadRequest(new { error = "to must be after from." });

        // Providers can only view their own blocks.
        if (User.IsInRole(Roles.Provider) && providerId != CallerId)
            return Forbid();

        var result = await service.ListAsync(tenant.TenantId, providerId, from, to);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType<BlockedSlotDto>(201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromQuery] string? providerId, BlockSlotRequest request)
    {
        // Providers always block their own calendar; Admins may specify a providerId.
        var targetProviderId = User.IsInRole(Roles.Provider) ? CallerId : (providerId ?? CallerId);

        try
        {
            var result = await service.CreateAsync(tenant.TenantId, targetProviderId, request);
            return CreatedAtAction(nameof(List), result);
        }
        catch (ValidationException ex) { return BadRequest(new { errors = ex.Errors }); }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var found = await service.DeleteAsync(tenant.TenantId, id, CallerId, User.IsInRole(Roles.Admin));
            return found ? NoContent() : NotFound();
        }
        catch (ForbiddenException ex) { return StatusCode(403, new { error = ex.Message }); }
    }
}
