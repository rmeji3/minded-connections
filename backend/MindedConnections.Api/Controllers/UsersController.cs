using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Api.Services.Users;
using MindedConnections.Shared.Constants;
using MindedConnections.Shared.Dtos.Users;
using MindedConnections.Shared.Exceptions;
using MindedConnections.Shared.Queries;

namespace MindedConnections.Api.Controllers;

[ApiController]
[Route("users")]
[Authorize(Roles = Roles.Admin)]
public class UsersController(IUsersService usersService) : ControllerBase
{
    // ── GET /users/stats ──────────────────────────────────────────────────────
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats() =>
        Ok(await usersService.GetStatsAsync());

    // ── GET /users ────────────────────────────────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] UserListQuery query) =>
        Ok(await usersService.GetUsersAsync(query));

    // ── GET /users/{id} ───────────────────────────────────────────────────────
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        try   { return Ok(await usersService.GetUserAsync(id)); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    // ── POST /users/providers ─────────────────────────────────────────────────
    [HttpPost("providers")]
    public async Task<IActionResult> CreateProvider(CreateProviderRequest req)
    {
        try   { return StatusCode(201, await usersService.CreateProviderAsync(req)); }
        catch (ValidationException ex) { return BadRequest(new { errors = ex.Errors }); }
    }

    // ── POST /users/patients ──────────────────────────────────────────────────
    [HttpPost("patients")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Provider}")]
    public async Task<IActionResult> CreatePatient(CreatePatientRequest req)
    {
        try   { return StatusCode(201, await usersService.CreatePatientAsync(req)); }
        catch (ValidationException ex) { return BadRequest(new { errors = ex.Errors }); }
    }

    // ── DELETE /users/{id} ────────────────────────────────────────────────────
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            await usersService.DeleteUserAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)  { return NotFound(new { error = ex.Message }); }
        catch (ValidationException ex)   { return BadRequest(new { errors = ex.Errors }); }
    }
}
