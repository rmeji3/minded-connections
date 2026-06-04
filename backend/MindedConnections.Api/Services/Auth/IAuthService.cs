using MindedConnections.Shared.Dtos.Auth;

namespace MindedConnections.Api.Services.Auth;

public interface IAuthService
{
    /// <summary>Validates credentials and returns tokens. Revokes any existing refresh tokens.</summary>
    Task<(LoginResponse Response, string RefreshToken)> LoginAsync(LoginRequest req);

    /// <summary>Validates and rotates a refresh token. Returns new tokens.</summary>
    Task<(string AccessToken, string RefreshToken)> RefreshAsync(string incomingToken);

    /// <summary>Revokes the given refresh token.</summary>
    Task LogoutAsync(string refreshToken);

    /// <summary>Returns the profile for the authenticated user.</summary>
    Task<UserInfo> GetMeAsync(string userId);
}
