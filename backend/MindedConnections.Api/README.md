# MindedConnections.Api

Core REST API. Handles authentication, user management, and admin operations.

## Endpoints

| Prefix | Controller | Auth required |
|---|---|---|
| `/auth` | `AuthController` | Bearer (me) |
| `/users` | `UsersController` | Bearer + Admin role |

## Directory map

| Directory | Purpose |
|---|---|
| `Controllers/` | Thin controllers — HTTP routing and exception-to-status mapping only |
| `Services/Auth/` | `IAuthService` / `AuthService` — user info (profile retrieval) |
| `Services/Users/` | `IUsersService` / `UsersService` — CRUD, pagination, stats |
| `Services/Supabase/` | `ISupabaseAdminService` / `SupabaseAdminService` — Supabase Admin API client (used to manage users/seed admin) |
| `Models/` | EF entity classes (`ApplicationUser`, `ProviderProfile`) |
| `Data/` | `AppDbContext` — EF Core DbContext and seed logic |
| `Migrations/` | EF Core migrations (committed to source control) |
| `logs/` | Serilog rolling log files (gitignored) |

## Architecture

- **Fat service / thin controller** — all business logic lives in services. See `STANDARDS.md §12`.
- Services inject `ILogger<T>` and throw typed domain exceptions (`ValidationException`, `NotFoundException`, etc.).
- Controllers catch typed exceptions and map them to HTTP status codes. No business logic in controllers.

## Auth design

- **Supabase Authentication**: The API validates JWTs issued by Supabase using JWKS (JSON Web Key Sets) provided by the Supabase authority.
- **Claims Transformation**: A custom `SupabaseClaimsTransformation` parses the user's role from the JWT (`app_metadata.role`) and maps it to ASP.NET Core `ClaimTypes.Role` for compatibility with `[Authorize(Roles = "...")]` attributes.
- **Database Identity**: Refresh tokens and passwords are not stored locally. Users are seeded or managed via the `SupabaseAdminService` first to establish a canonical UUID, which is then written to the local PostgreSQL database for relational mapping.

## Running

```bash
dotnet run   # http://localhost:5050
```

Requires `appsettings.Development.json` — see [`../README.md`](../README.md).

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §12–20.
