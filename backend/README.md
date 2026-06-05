# backend

ASP.NET Core 10 backend for MindEd Connections. Composed of three projects:

## Projects

| Project | README | Purpose |
|---|---|---|
| `MindedConnections.Api` | [→](MindedConnections.Api/README.md) | Core REST API — auth, users, admin |
| `MindedConnections.Scheduling` | [→](MindedConnections.Scheduling/README.md) | Scheduling microservice — appointments, availability |
| `MindedConnections.Shared` | [→](MindedConnections.Shared/README.md) | Shared DTOs, query objects, response wrappers, exceptions |

## First-time setup (after cloning)

> ⚠️ `dotnet run` must be run from inside a project folder, not from `backend/`. Running it from `backend/` will fail with "no .csproj found".

```bash
# 1. Restore NuGet packages for the whole solution
cd backend
dotnet restore MindedConnections.sln

# 2. Create appsettings.Development.json in each API project (see below)

# 3. Run the core API
cd MindedConnections.Api
dotnet run
# → http://localhost:5050

# 4. (Optional) Run the scheduling service in a second terminal
cd ../MindedConnections.Scheduling
dotnet run
# → http://localhost:5020
```

## Required: `appsettings.Development.json`

This file is gitignored — you must create it manually in **each** API project folder before running.

**`MindedConnections.Api/appsettings.Development.json`:**
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Debug",
      "Override": {
        "Microsoft": "Information",
        "Microsoft.EntityFrameworkCore.Database.Command": "Information"
      }
    }
  },
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=minded;Username=postgres;Password=postgres"
  },
  "Supabase": {
    "ServiceRoleKey": "your-supabase-service-role-key-here"
  },
  "Seed": {
    "AdminEmail": "you@example.com",
    "AdminPassword": "Password1!"
  }
}
```

**`MindedConnections.Scheduling/appsettings.Development.json`:**
```json
{
  "ConnectionStrings": {
    "Scheduling": "Host=localhost;Port=5432;Database=minded;Username=postgres;Password=postgres"
  }
}
```

## Requirements

- [.NET SDK 10](https://dotnet.microsoft.com/download) (`global.json` pins the version)
- PostgreSQL running on port 5432

## Standards

Sections 12–20 of [`../STANDARDS.md`](../STANDARDS.md) apply to all backend projects.
