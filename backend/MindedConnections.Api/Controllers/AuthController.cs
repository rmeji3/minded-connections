using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Api.Services.Auth;

namespace MindedConnections.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                  ?? HttpContext.User.FindFirst("sub")?.Value;

        if (userId is null) return Unauthorized();

        try
        {
            var userInfo = await authService.GetMeAsync(userId);
            return Ok(userInfo);
        }
        catch (KeyNotFoundException) { return NotFound(); }
    }
}
