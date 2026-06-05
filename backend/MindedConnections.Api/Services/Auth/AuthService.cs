using Microsoft.AspNetCore.Identity;
using MindedConnections.Api.Models;
using MindedConnections.Shared.Dtos.Auth;

namespace MindedConnections.Api.Services.Auth;

public sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<UserInfo> GetMeAsync(string userId)
    {
        var user = await userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        var roles = await userManager.GetRolesAsync(user);

        logger.LogDebug("Profile fetched for user {UserId}", userId);

        return new UserInfo(
            Id:        user.Id,
            Email:     user.Email!,
            Role:      roles.FirstOrDefault() ?? string.Empty,
            FirstName: user.FirstName,
            LastName:  user.LastName);
    }
}
