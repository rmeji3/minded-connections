# MindedConnections.Scheduling

Scheduling microservice. Manages provider availability, appointment slots, bookings, notifications, audit logs, and care relationships.

## Tech stack

- ASP.NET Core 10 / .NET 10
- PostgreSQL via Npgsql + Entity Framework Core 10
- Supabase JWT (JWKS) authentication
- Background `IHostedService` for notification dispatch

## Running locally

```bash
dotnet run   # http://localhost:5051
```

Requires `appsettings.Development.json`:

```json
{
  "ConnectionStrings": { "Scheduling": "Host=localhost;Port=5432;Database=minded_scheduling;Username=postgres;Password=postgres" },
  "Cors": { "Origin": "http://localhost:3000" },
  "Jitsi": { "BaseUrl": "https://meet.jit.si" },
  "Supabase": { "Authority": "https://<project>.supabase.co/auth/v1" },
  "Scheduling": {
    "CancellationDeadlineHours": 24,
    "RescheduleDeadlineHours": 24,
    "MaxRescheduleCount": 3
  }
}
```

## Environment variables (production)

| Variable | Config key | Description |
|---|---|---|
| `SCHEDULING_DATABASE_URL` | `ConnectionStrings:Scheduling` | Postgres connection string |
| `CORS_ORIGIN` | `Cors:Origin` | Allowed frontend origin |
| `SUPABASE_AUTHORITY` | `Supabase:Authority` | Supabase JWKS authority URL |
| `JITSI_BASE_URL` | `Jitsi:BaseUrl` | Jitsi Meet base URL |
| `CANCELLATION_DEADLINE_HOURS` | `Scheduling:CancellationDeadlineHours` | Hours before appt patients must cancel by |
| `RESCHEDULE_DEADLINE_HOURS` | `Scheduling:RescheduleDeadlineHours` | Hours before appt patients must reschedule by |
| `MAX_RESCHEDULE_COUNT` | `Scheduling:MaxRescheduleCount` | Max reschedules per appointment (default 3) |

## Endpoints

| Prefix | Purpose | Auth |
|---|---|---|
| `GET /health` | Health check | Public |
| `/tenants` | Tenant admin — create, deactivate, rotate API key | JWT (Admin) |
| `/availability` | Provider weekly availability rules (CRUD) | JWT + API Key |
| `/slots` | Available bookable slots | JWT + API Key |
| `/appointments` | Book, list, cancel, reschedule, iCal export | JWT + API Key |
| `/appointments/stats` | Patient attendance stats | JWT + API Key (Patient only) |
| `/appointments/provider-stats` | Provider schedule dashboard | JWT + API Key (Provider/Admin) |
| `/appointments/recurring` | Book a recurring series | JWT + API Key |
| `/appointments/recurring/{groupId}/cancel` | Cancel a recurring series | JWT + API Key |
| `/appointments/{id}/ical` | iCal `.ics` export | JWT + API Key |
| `/blocked-slots` | Provider unavailability windows | JWT + API Key (Provider/Admin) |
| `/care-relationships` | Patient–provider assignment | JWT + API Key |
| `/services` | Service type catalog | JWT + API Key |

## Directory map

| Directory | Purpose |
|---|---|
| `Controllers/` | Thin controllers — routing and HTTP mapping only |
| `Models/` | EF entity classes |
| `Data/` | `SchedulingDbContext` with all entity configs and indexes |
| `Services/Appointments/` | Core booking logic — single, recurring, reschedule, stats |
| `Services/Audit/` | `AuditService` — queryable write-trail for all domain events |
| `Services/Notifications/` | Outbox queue + `NotificationWorker` + `IEmailSender` |
| `Services/CareRelationships/` | Patient–provider relationship management |
| `Services/BlockedSlots/` | Provider unavailability windows |
| `Services/Availability/` | Weekly availability rules (CRUD) |
| `Services/Slots/` | Slot generation from availability rules minus blocks |
| `Services/Tenants/` | Tenant lifecycle including API key rotation |
| `Services/ServiceTypes/` | Service catalog (Admin-managed) |
| `Middleware/` | `TenantMiddleware`, `SupabaseClaimsTransformation`, `GlobalExceptionHandler` |
| `Dtos/` | Request/response objects per domain area |
| `Migrations/` | EF Core migrations |

## Architecture

### Multi-tenancy
All non-health endpoints require an `X-Api-Key` header. `TenantMiddleware` validates it against hashed keys and populates a scoped `TenantContext` for the request.

### Authentication & roles
Supabase JWTs are validated via JWKS. `SupabaseClaimsTransformation` extracts `app_metadata.role` into `ClaimTypes.Role`. Roles: `Admin`, `Provider`, `Patient`.

### Fat service / thin controller
All business logic lives in services. Controllers do routing and HTTP mapping only. See `STANDARDS.md §12`.

### Notifications
Notifications are queued to the `notification_outbox` table at event time (booking, cancel, reschedule). A `NotificationWorker` (`IHostedService`) polls every minute and dispatches via `IEmailSender`.

**Current sender:** `ConsoleEmailSender` — logs to console only. To connect a real provider:
1. Implement `IEmailSender` in a new class (e.g., `ResendEmailSender`).
2. Add provider config keys under `"Email"` in `appsettings.json`.
3. Swap the registration in `Program.cs`: `builder.Services.AddScoped<IEmailSender, ResendEmailSender>()`.

### Audit log
Every write operation appends a row to `audit_logs` with actor, entity, action, and a JSON metadata blob. Failures are caught and logged — they never surface to callers.

### Care relationships
A patient must have an active `CareRelationship` with a provider to book non-initial-consultation appointments. The relationship is auto-created after a successful Initial Consultation booking. Admins can manually assign or deactivate relationships.

### Rate limiting
- `booking` policy: 10 req/min on `POST /appointments` and `POST /appointments/recurring`
- `api-global` policy: 120 req/min on all other routes

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §12–23.
