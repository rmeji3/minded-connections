# MindEd Connections

Full-stack web platform for MindEd Connections — a licensed educational psychology practice. Provides a patient portal, provider portal, admin dashboard, online scheduling, and a public marketing site.

## Monorepo structure

```
minded-connections/
  frontend/          Next.js 16 app (portal, admin, public site)
  backend/
    MindedConnections.Api/        Core API — auth, users, admin
    MindedConnections.Scheduling/ Scheduling microservice
    MindedConnections.Shared/     Shared DTOs, queries, exceptions
  STANDARDS.md       Coding standards for all contributors and agents
  AGENTS.md          AI agent instructions (references STANDARDS.md)
  CLAUDE.md          Claude-specific entry point
  .github/copilot-instructions.md   GitHub Copilot instructions
  .cursor/rules/standards.mdc       Cursor rules
```

## Quick start

```bash
# 1. Start the database (PostgreSQL)
docker compose up -d db

# 2. Backend
cd backend/MindedConnections.Api
dotnet run

# 3. Frontend
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000  
API: http://localhost:5050

## Documentation

Every source directory has its own `README.md`. Start with the relevant one:

- [`frontend/README.md`](frontend/README.md)
- [`backend/README.md`](backend/README.md)

## Standards

All contributors and AI agents must follow [`STANDARDS.md`](STANDARDS.md).
