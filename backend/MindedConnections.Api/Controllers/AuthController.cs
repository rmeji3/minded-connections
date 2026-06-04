using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindedConnections.Api.Services.Auth;
using MindedConnections.Shared.Dtos.Auth;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    private const string RefreshCookie = "refresh_token";

    private CookieOptions RefreshCookieOptions(bool secure) => new()
    {
        HttpOnly = true,
        Secure   = secure,
        SameSite = SameSiteMode.Strict,
        MaxAge   = TimeSpan.FromDays(7),
        Path     = "/",
    };

    // ── POST /auth/login ──────────────────────────────────────────────────────
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginRequest req,
        [FromServices] IConfiguration config)
    {
        try
        {
            var (response, refreshToken) = await authService.LoginAsync(req);
            Response.Cookies.Append(RefreshCookie, refreshToken,
                RefreshCookieOptions(config.GetValue<bool>("Cookie:Secure")));
            return Ok(response);
        }
        catch (UnauthorizedException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    // ── POST /auth/refresh ────────────────────────────────────────────────────
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromServices] IConfiguration config)
    {
        if (!Request.Cookies.TryGetValue(RefreshCookie, out var token) ||
            string.IsNullOrEmpty(token))
            return Unauthorized(new { error = "No refresh token present." });

        try
        {
            var (accessToken, newRefreshToken) = await authService.RefreshAsync(token);
            Response.Cookies.Append(RefreshCookie, newRefreshToken,
                RefreshCookieOptions(config.GetValue<bool>("Cookie:Secure")));
            return Ok(new { access_token = accessToken, expires_in = 15 * 60 });
        }
        catch (UnauthorizedException ex)
        {
            Response.Cookies.Delete(RefreshCookie);
            return Unauthorized(new { error = ex.Message });
        }
    }

    // ── POST /auth/logout ─────────────────────────────────────────────────────
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        if (Request.Cookies.TryGetValue(RefreshCookie, out var token))
            await authService.LogoutAsync(token);

        Response.Cookies.Delete(RefreshCookie);
        return NoContent();
    }

    // ── GET /auth/me ──────────────────────────────────────────────────────────
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                  ?? HttpContext.User.FindFirst("sub")?.Value;

        if (userId is null) return Unauthorized();

        var userInfo = await authService.GetMeAsync(userId);
        return Ok(userInfo);
    }
}
