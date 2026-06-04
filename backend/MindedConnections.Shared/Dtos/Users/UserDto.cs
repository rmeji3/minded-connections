namespace MindedConnections.Shared.Dtos.Users;

public record UserDto(
    string  Id,
    string  Email,
    string? FirstName,
    string? LastName,
    string? Phone,
    string? Role,
    string  CreatedAt
);
