using System.Net.Http.Headers;
using System.Text.Json;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Api.Services.Supabase;

public class SupabaseAdminService(
    HttpClient http,
    ILogger<SupabaseAdminService> logger) : ISupabaseAdminService
{
    private static readonly JsonSerializerOptions _json = new() { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower };

    public async Task<string> CreateUserAsync(string email, string password, string role)
    {
        var payload = new
        {
            email,
            password,
            email_confirm = true,
            app_metadata  = new { role },
        };

        var res = await http.PostAsJsonAsync("admin/users", payload, _json);

        if (res.IsSuccessStatusCode)
        {
            var result = await res.Content.ReadFromJsonAsync<JsonElement>();
            var id = result.GetProperty("id").GetString()
                ?? throw new InvalidOperationException("Supabase did not return a user ID.");

            logger.LogInformation("Supabase user created: {SupabaseId} ({Email}, role={Role})", id, email, role);
            return id;
        }

        var body = await res.Content.ReadAsStringAsync();

        // If the email is already registered, look up the existing user and return their UUID.
        // This handles re-seeding and idempotent admin calls.
        if ((int)res.StatusCode == 422)
        {
            try
            {
                using var errDoc = JsonDocument.Parse(body);
                if (errDoc.RootElement.TryGetProperty("error_code", out var code) &&
                    code.GetString() == "email_exists")
                {
                    logger.LogInformation("Supabase user already exists for {Email} — looking up UUID", email);
                    return await GetExistingUserIdByEmailAsync(email, role);
                }

                if (errDoc.RootElement.TryGetProperty("msg", out var msg))
                    throw new ValidationException([msg.GetString() ?? "Supabase error."]);
            }
            catch (JsonException) { }
        }

        logger.LogWarning("Supabase user creation failed for {Email}: {Status} {Body}", email, res.StatusCode, body);
        throw new ValidationException([$"Failed to create Supabase account ({(int)res.StatusCode})."]);
    }

    public async Task DeleteUserAsync(string supabaseUserId)
    {
        var res = await http.DeleteAsync($"admin/users/{supabaseUserId}");

        if (!res.IsSuccessStatusCode)
            logger.LogWarning("Supabase user deletion failed for {SupabaseId}: {Status}", supabaseUserId, res.StatusCode);
        else
            logger.LogInformation("Supabase user deleted: {SupabaseId}", supabaseUserId);
    }

    // ─────────────────────────────────────────────────────────────────────────

    private async Task<string> GetExistingUserIdByEmailAsync(string email, string role)
    {
        var res = await http.GetAsync($"admin/users?filter={Uri.EscapeDataString(email)}&page=1&per_page=1000");
        res.EnsureSuccessStatusCode();

        var body = await res.Content.ReadFromJsonAsync<JsonElement>();

        // Response is { "users": [...] }
        var users = body.GetProperty("users");
        foreach (var user in users.EnumerateArray())
        {
            if (user.TryGetProperty("email", out var emailProp) &&
                string.Equals(emailProp.GetString(), email, StringComparison.OrdinalIgnoreCase))
            {
                var id = user.GetProperty("id").GetString()!;

                // Ensure app_metadata.role is set correctly.
                await http.PutAsJsonAsync($"admin/users/{id}", new { app_metadata = new { role } }, _json);

                logger.LogInformation("Resolved existing Supabase user {SupabaseId} for {Email}", id, email);
                return id;
            }
        }

        throw new InvalidOperationException($"Could not find Supabase user with email {email}.");
    }
}
