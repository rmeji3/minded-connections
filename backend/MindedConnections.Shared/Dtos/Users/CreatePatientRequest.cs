namespace MindedConnections.Shared.Dtos.Users;

public record CreatePatientRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? Phone,
    string? Timezone
);
