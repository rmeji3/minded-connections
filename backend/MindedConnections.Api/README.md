# MindedConnections.Api

Core REST API. Handles authentication, user management, and admin operations.

## Endpoints

| Prefix | Controller | Auth required |
|---|---|---|
| `/auth` | `AuthController` | Public (login, refresh) / Bearer (logout, me) |
| `/users` | `UsersController` | Bearer + Admin role |

## Directory map

| Directory | Purpose |
|---|---|
| `Controllers/` | Thin controllers — HTTP routing and exception-to-status mapping only |
| `Services/Auth/` | `IAuthService` / `AuthService` — login, logout, token refresh, user info |
| `Services/Users/` | `IUsersService` / `UsersService` — CRUD, pagination, stats |
| `Services/Jwt/` | `IJwtService` / `JwtService` — access token generation, refresh token creation |
| `Models/` | EF entity classes (`ApplicationUser`, `RefreshToken`, `ProviderProfile`) |
| `Data/` | `AppDbContext` — EF Core DbContext and seed logic |
| `Migrations/` | EF Core migrations (committed to source control) |
| `logs/` | Serilog rolling log files (gitignored) |

## Architecture

- **Fat service / thin controller** — all business logic lives in services. See `STANDARDS.md §12`.
- Services inject `ILogger<T>` and throw typed domain exceptions (`ValidationException`, `NotFoundException`, etc.).
- Controllers catch typed exceptions and map them to HTTP status codes. No business logic in controllers.

## Auth design

- JWT Bearer (HMAC-SHA256). Access tokens: 15 min. Refresh tokens: 7 days, rotate on every use.
- Refresh tokens stored in the `RefreshTokens` table, revoked on logout and password change.
- Tokens issued as HttpOnly cookies by the Next.js Route Handler proxy — the API itself returns them in the response body.

## Running

```bash
dotnet run   # http://localhost:5050
```

Requires `appsettings.Development.json` — see [`../README.md`](../README.md).

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §12–20.
