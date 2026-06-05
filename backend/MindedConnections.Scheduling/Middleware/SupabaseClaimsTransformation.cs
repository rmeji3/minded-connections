using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;

namespace MindedConnections.Scheduling.Middleware;

/// <summary>
/// Extracts the app-level role from Supabase's app_metadata claim and maps it
/// to ClaimTypes.Role so [Authorize(Roles = "Provider")] works as expected.
/// </summary>
public class SupabaseClaimsTransformation : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        var appMetaClaim = principal.FindFirst("app_metadata");
        if (appMetaClaim is null) return Task.FromResult(principal);

        try
        {
            using var doc = JsonDocument.Parse(appMetaClaim.Value);
            if (doc.RootElement.TryGetProperty("role", out var roleProp))
            {
                var role = roleProp.GetString();
                if (!string.IsNullOrEmpty(role))
                {
                    var identity = new ClaimsIdentity();
                    identity.AddClaim(new Claim(ClaimTypes.Role, role));
                    principal.AddIdentity(identity);
                }
            }
        }
        catch (JsonException) { }

        return Task.FromResult(principal);
    }
}
