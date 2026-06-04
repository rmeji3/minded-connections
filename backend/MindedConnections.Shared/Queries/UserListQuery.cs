namespace MindedConnections.Shared.Queries;

/// <summary>
/// Query parameters for <c>GET /users</c>.
/// </summary>
public record UserListQuery : PaginatedQuery
{
    /// <summary>Filter by role name (Admin, Provider, Patient). Null = all roles.</summary>
    public string? Role   { get; init; }

    /// <summary>Case-insensitive search across email, first name, last name.</summary>
    public string? Search { get; init; }
}
