using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Scheduling.Dtos.ServiceTypes;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Services.ServiceTypes;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Controllers;

[ApiController]
[Route("services")]
[Authorize]
public class ServiceTypesController(IServiceTypeService serviceTypes, ITenantContext tenant) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<ServiceTypeDto>>(200)]
    public async Task<IActionResult> List()
    {
        var result = await serviceTypes.ListAsync(tenant.TenantId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType<ServiceTypeDto>(201)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> Create(CreateServiceTypeRequest request)
    {
        try
        {
            var result = await serviceTypes.CreateAsync(tenant.TenantId, request);
            return CreatedAtAction(nameof(List), result);
        }
        catch (ConflictException ex) { return Conflict(new { error = ex.Message }); }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Deactivate(string id)
    {
        var found = await serviceTypes.DeactivateAsync(tenant.TenantId, id);
        return found ? NoContent() : NotFound();
    }
}
