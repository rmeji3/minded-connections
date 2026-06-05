using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;

namespace MindedConnections.Api.Services.Auth;

/// <summary>
/// Extracts the app-level role from Supabase's app_metadata claim and maps it
/// to ClaimTypes.Role so [Authorize(Roles = "Provider")] works as expected.
///
/// Supabase embeds app_metadata as a JSON object claim. The role field
/// inside it is the one we control (set via Supabase Admin API or dashboard).
/// The top-level "role" claim is Supabase's internal role ("authenticated")
/// and must not be confused with our application roles.
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
        catch (JsonException)
        {
            // Malformed claim — skip transformation rather than crashing the request.
        }

        return Task.FromResult(principal);
    }
}
