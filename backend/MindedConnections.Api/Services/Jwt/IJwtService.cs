using MindedConnections.Api.Models;

namespace MindedConnections.Api.Services.Jwt;

public interface IJwtService
{
    string       GenerateAccessToken(ApplicationUser user, IList<string> roles);
    RefreshToken GenerateRefreshToken(string userId);
}
