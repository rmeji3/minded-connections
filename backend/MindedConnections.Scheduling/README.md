# MindedConnections.Scheduling

Scheduling microservice. Manages provider availability, appointment slots, and bookings.

## Status

✅ Fully implemented — database migrations, controllers, models, and domain services in place.

## Endpoints

| Prefix | Purpose | Auth required |
|---|---|---|
| `/tenants` | Tenant account registration and lookup | API Key |
| `/availability` | Provider availability windows (CRUD) | Bearer (Supabase JWT) + API Key |
| `/slots` | Generated bookable time slots | Bearer (Supabase JWT) + API Key |
| `/appointments` | Appointment booking and management | Bearer (Supabase JWT) + API Key |

## Directory map

| Directory | Purpose |
|---|---|
| `Controllers/` | Thin controllers — routing and exception mapping only |
| `Models/` | EF entity classes (`Tenant`, `Appointment`, `Availability`, `TimeSlot`) |
| `Data/` | `SchedulingDbContext` |
| `Services/` | Scoped services matching domain areas (Appointments, Availability, Slots, Tenants) |
| `Middleware/` | `TenantMiddleware` (tenant context population) and `SupabaseClaimsTransformation` |
| `Dtos/` | Typed request/response objects for all endpoints |

## Architecture & Multi-Tenancy

- **Fat service / thin controller** — all business logic lives in services. See `STANDARDS.md §12`.
- **Multi-Tenancy**: The microservice is multi-tenant. All non-health requests must supply an `X-Api-Key` header. `TenantMiddleware` validates this key against hashed tenant keys in the database and populates a scoped `TenantContext` containing the resolved `TenantId` for the request lifecycle.
- **Authentication & Roles**: Endpoint security validates Supabase-issued tokens via JWKS. A custom `SupabaseClaimsTransformation` extracts the user's role from the token to enable standard ASP.NET Core authorization gates.

## Running

```bash
dotnet run   # http://localhost:5051
```

Requires `appsettings.Development.json` with a `ConnectionStrings.Default` pointing to the same PostgreSQL instance as the core API.

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §12–20.
