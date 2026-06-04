# MindedConnections.Scheduling

Scheduling microservice. Manages provider availability, appointment slots, and bookings.

## Status

🚧 In progress — controllers and models scaffolded; service layer and EF migrations pending.

## Planned endpoints

| Prefix | Purpose |
|---|---|
| `/availability` | Provider availability windows (CRUD) |
| `/slots` | Generated bookable time slots |
| `/appointments` | Appointment booking and management |

## Directory map

| Directory | Purpose |
|---|---|
| `Controllers/` | Thin controllers — routing and exception mapping only |
| `Models/` | EF entity classes (`Appointment`, `AppointmentType`) |
| `Data/` | `SchedulingDbContext` |
| `Services/` | Service interfaces and implementations (to be created) |

## Architecture

Follows the same fat service / thin controller pattern as `MindedConnections.Api`. See `STANDARDS.md §12`.

Each domain area gets its own `Services/<Domain>/` subfolder with an interface + implementation pair.

## Running

```bash
dotnet run   # http://localhost:5051
```

Requires `appsettings.Development.json` with a `ConnectionStrings.Default` pointing to the same PostgreSQL instance as the core API.

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §12–20.
