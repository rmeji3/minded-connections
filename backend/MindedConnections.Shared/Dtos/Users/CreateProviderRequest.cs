namespace MindedConnections.Shared.Dtos.Users;

public record CreateProviderRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string Title,
    string? Specialty,
    string? Bio,
    string? Phone,
    string? Timezone
);
