namespace MindedConnections.Api.Services.Supabase;

public interface ISupabaseAdminService
{
    /// <summary>
    /// Creates a user in Supabase with email_confirm = true and the given role in app_metadata.
    /// If the email already exists in Supabase, updates their app_metadata role and returns the existing UUID.
    /// Returns the Supabase UUID to use as ApplicationUser.Id.
    /// </summary>
    Task<string> CreateUserAsync(string email, string password, string role);

    /// <summary>Permanently deletes the user from Supabase.</summary>
    Task DeleteUserAsync(string supabaseUserId);
}
