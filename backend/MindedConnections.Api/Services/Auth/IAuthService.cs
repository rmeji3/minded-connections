using MindedConnections.Shared.Dtos.Auth;

namespace MindedConnections.Api.Services.Auth;

public interface IAuthService
{
    /// <summary>Returns the profile for the authenticated user.</summary>
    Task<UserInfo> GetMeAsync(string userId);
}
