namespace MindedConnections.Shared.Dtos.Auth;

public record LoginResponse(
    string AccessToken,
    int ExpiresIn,
    UserInfo User
);

public record UserInfo(
    string Id,
    string Email,
    string Role,
    string? FirstName,
    string? LastName
);
