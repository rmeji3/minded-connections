# backend

ASP.NET Core 10 backend for MindEd Connections. Composed of three projects:

## Projects

| Project | README | Purpose |
|---|---|---|
| `MindedConnections.Api` | [→](MindedConnections.Api/README.md) | Core REST API — auth, users, admin |
| `MindedConnections.Scheduling` | [→](MindedConnections.Scheduling/README.md) | Scheduling microservice — appointments, availability |
| `MindedConnections.Shared` | [→](MindedConnections.Shared/README.md) | Shared DTOs, query objects, response wrappers, exceptions |

## Running locally

```bash
# Core API (port 5050)
cd MindedConnections.Api
dotnet run

# Scheduling service (port 5051)
cd MindedConnections.Scheduling
dotnet run
```

**Required `appsettings.Development.json`** (gitignored — create manually):
```json
{
  "ConnectionStrings": { "Default": "Host=localhost;Port=5432;Database=minded;Username=postgres;Password=postgres" },
  "Jwt": {
    "Secret": "<32+ char secret>",
    "Issuer": "minded-connections-api",
    "Audience": "minded-connections-clients"
  },
  "Seed": { "AdminEmail": "you@example.com", "AdminPassword": "Password1!" },
  "Cookie": { "Secure": false }
}
```

## Standards

Sections 12–20 of [`../STANDARDS.md`](../STANDARDS.md) apply to all backend projects.
