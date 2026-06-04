using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MindedConnections.Api.Data;
using MindedConnections.Api.Models;
using MindedConnections.Api.Services.Jwt;
using MindedConnections.Shared.Dtos.Auth;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Api.Services.Auth;

public sealed class AuthService(
    UserManager<ApplicationUser>    userManager,
    IJwtService                     jwtService,
    AppDbContext                    db,
    ILogger<AuthService>            logger) : IAuthService
{
    // ─────────────────────────────────────────────────────────────────────────
    // Login
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<(LoginResponse Response, string RefreshToken)> LoginAsync(LoginRequest req)
    {
        var user = await userManager.FindByEmailAsync(req.Email);

        if (user is null || !await userManager.CheckPasswordAsync(user, req.Password))
        {
            logger.LogWarning("Failed login attempt for {Email}", req.Email);
            throw new UnauthorizedException("Invalid email or password.");
        }

        if (!await userManager.IsEmailConfirmedAsync(user))
        {
            logger.LogWarning("Login blocked — email not confirmed for {Email}", req.Email);
            throw new UnauthorizedException("Account is not yet active.");
        }

        var roles        = await userManager.GetRolesAsync(user);
        var accessToken  = jwtService.GenerateAccessToken(user, roles);
        var refreshToken = jwtService.GenerateRefreshToken(user.Id);

        // Single active session per user — revoke any existing tokens
        await db.RefreshTokens
            .Where(r => r.UserId == user.Id && r.RevokedAt == null)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.RevokedAt, DateTime.UtcNow));

        db.RefreshTokens.Add(refreshToken);
        await db.SaveChangesAsync();

        logger.LogInformation("User {UserId} ({Email}) logged in with role(s) {Roles}",
            user.Id, user.Email, string.Join(", ", roles));

        var response = new LoginResponse(
            AccessToken: accessToken,
            ExpiresIn:   15 * 60,
            User: new UserInfo(
                Id:        user.Id,
                Email:     user.Email!,
                Role:      roles.FirstOrDefault() ?? string.Empty,
                FirstName: user.FirstName,
                LastName:  user.LastName));

        return (response, refreshToken.Token);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Refresh
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<(string AccessToken, string RefreshToken)> RefreshAsync(string incomingToken)
    {
        var stored = await db.RefreshTokens
            .Include(r => r.User)
            .SingleOrDefaultAsync(r => r.Token == incomingToken);

        if (stored is null || !stored.IsActive)
        {
            logger.LogWarning("Refresh token rejected — invalid or expired. Token prefix: {Prefix}",
                incomingToken[..Math.Min(8, incomingToken.Length)]);
            throw new UnauthorizedException("Refresh token is invalid or expired.");
        }

        // Rotate
        stored.RevokedAt = DateTime.UtcNow;
        var newRefresh = jwtService.GenerateRefreshToken(stored.UserId);
        db.RefreshTokens.Add(newRefresh);
        await db.SaveChangesAsync();

        var roles       = await userManager.GetRolesAsync(stored.User);
        var accessToken = jwtService.GenerateAccessToken(stored.User, roles);

        logger.LogDebug("Refresh token rotated for user {UserId}", stored.UserId);

        return (accessToken, newRefresh.Token);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Logout
    // ─────────────────────────────────────────────────────────────────────────

    public async Task LogoutAsync(string refreshToken)
    {
        var stored = await db.RefreshTokens
            .SingleOrDefaultAsync(r => r.Token == refreshToken);

        if (stored is not null)
        {
            stored.RevokedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            logger.LogInformation("User {UserId} logged out", stored.UserId);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Me
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<UserInfo> GetMeAsync(string userId)
    {
        var user = await userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        var roles = await userManager.GetRolesAsync(user);

        return new UserInfo(
            Id:        user.Id,
            Email:     user.Email!,
            Role:      roles.FirstOrDefault() ?? string.Empty,
            FirstName: user.FirstName,
            LastName:  user.LastName);
    }
}
