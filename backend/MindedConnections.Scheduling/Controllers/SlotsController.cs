using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Scheduling.Dtos.Slots;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Services.Slots;

namespace MindedConnections.Scheduling.Controllers;

[ApiController]
[Route("slots")]
[Authorize]
public class SlotsController(ISlotService slots, ITenantContext tenant) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<SlotDto>>(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetAvailable(
        [FromQuery] string providerId,
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        if (string.IsNullOrWhiteSpace(providerId))
            return BadRequest(new { error = "providerId is required." });

        if (from.Date < DateTime.UtcNow.Date)
            return BadRequest(new { error = "from must not be in the past." });

        if (to <= from)
            return BadRequest(new { error = "to must be after from." });

        if ((to - from).TotalDays > 90)
            return BadRequest(new { error = "Date range cannot exceed 90 days." });

        var result = await slots.GetAvailableAsync(tenant.TenantId, providerId, from, to);
        return Ok(result);
    }
}
