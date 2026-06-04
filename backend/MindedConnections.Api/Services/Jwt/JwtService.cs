using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MindedConnections.Api.Models;

namespace MindedConnections.Api.Services.Jwt;

public sealed class JwtService(IConfiguration config) : IJwtService
{
    private const int AccessTokenMinutes = 15;
    private const int RefreshTokenDays   = 7;

    public string GenerateAccessToken(ApplicationUser user, IList<string> roles)
    {
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub,   user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
        };

        foreach (var role in roles)
            claims.Add(new Claim(ClaimTypes.Role, role));

        var token = new JwtSecurityToken(
            issuer:             config["Jwt:Issuer"],
            audience:           config["Jwt:Audience"],
            claims:             claims,
            expires:            DateTime.UtcNow.AddMinutes(AccessTokenMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public RefreshToken GenerateRefreshToken(string userId) => new()
    {
        Token     = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
        UserId    = userId,
        ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenDays),
        CreatedAt = DateTime.UtcNow,
    };
}
