# MindedConnections.Shared

Class library shared by `MindedConnections.Api` and `MindedConnections.Scheduling`. Contains DTOs, query objects, response wrappers, and domain exceptions.

**Dependency rule:** this project has zero references to Api or Scheduling. Both API projects reference Shared — never the reverse.

## Directory map

| Directory | Purpose |
|---|---|
| `Dtos/Auth/` | `LoginRequest`, `LoginResponse` |
| `Dtos/Users/` | `UserDto`, `UserStats`, `CreateProviderRequest`, `CreatePatientRequest` |
| `Queries/` | `PaginatedQuery` (base), `UserListQuery` |
| `Exceptions/` | `ValidationException`, `UnauthorizedException` |
| `Constants/` | Shared string constants (role names, policy names) |

## Key types

### `PaginatedQuery`
Base record for all paginated list queries. Provides `SafePage`, `SafePageSize`, `Skip`. Domain-specific query records inherit from this.

```csharp
public record UserListQuery : PaginatedQuery
{
    public string? Role   { get; init; }
    public string? Search { get; init; }
}
```

### `PagedResponse<T>`
Standard envelope for all paginated API responses. Includes `Items`, `Page`, `PageSize`, `Total`, `TotalPages`, `HasNext`, `HasPrev`.

### Domain exceptions
Thrown by services, caught by controllers and mapped to HTTP status codes (see `STANDARDS.md §16`):

| Exception | Maps to |
|---|---|
| `ValidationException` | `400 Bad Request` |
| `UnauthorizedException` | `401 Unauthorized` |

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §12–20.
