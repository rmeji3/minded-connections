using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Scheduling.Dtos.Tenants;
using MindedConnections.Scheduling.Services.Tenants;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Controllers;

[ApiController]
[Route("tenants")]
[Authorize(Roles = "Admin")]
public class TenantsController(ITenantService tenants) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<TenantDto>>(200)]
    public async Task<IActionResult> List()
    {
        var result = await tenants.ListAsync();
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType<CreateTenantResponse>(201)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> Create(CreateTenantRequest request)
    {
        try
        {
            var result = await tenants.CreateAsync(request);
            return CreatedAtAction(nameof(List), result);
        }
        catch (ConflictException ex) { return Conflict(new { error = ex.Message }); }
    }

    [HttpPatch("{tenantId}/deactivate")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Deactivate(string tenantId)
    {
        var found = await tenants.DeactivateAsync(tenantId);
        return found ? NoContent() : NotFound();
    }
}
