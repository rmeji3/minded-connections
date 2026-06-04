# MindEd Connections — Copilot Instructions

> These instructions apply to all Copilot suggestions in this repository.
> The full standards are in `STANDARDS.md` at the repo root — read it before generating any code.

This is a Next.js + ASP.NET Core 10 monorepo. Key rules are summarised below; `STANDARDS.md` is the authoritative reference.

---

## Frontend (Next.js)

- Named exports only — default exports only in `page.tsx` files.
- `"use client"` only when state, effects, or browser APIs are needed.
- Tailwind first for all styling. Design tokens via CSS variables (`var(--sage-500)`, `var(--linen)`, etc.) — never raw hex values.
- All imports use the `@/` alias. Import order: React/Next → third-party → components → lib → types.
- `import * as React from "react"` — never the default import.
- No form libraries — native `<form>` with local state validation.
- Every interactive element needs keyboard access, visible focus ring, and ARIA labels where required.
- Use `next/image` for images, `next/link` for internal navigation.

## Backend (ASP.NET Core)

- **Fat service / thin controller.** Controllers translate HTTP only (≤ 15 lines per action). All logic lives in services under `Services/<Domain>/`.
- Services throw typed exceptions (`ValidationException`, `NotFoundException`, `ConflictException`, `UnauthorizedException`). Controllers catch and map to HTTP status codes.
- Every list endpoint is paginated using `PaginatedQuery` + `PagedResponse<T>` from the Shared project.
- Structured Serilog logging at the service layer. Never interpolate strings into log messages — use message templates with named properties.
- Rate limiting on all public/auth endpoints using ASP.NET Core's built-in `RateLimiter`.
- All EF calls must be async. Never `ToList()` before `Where()`. Use `Select()` projections — never return full entity graphs.
- JWT secrets and connection strings go in `appsettings.Development.json` (gitignored) or environment variables — never in `appsettings.json`.

## Documentation

- Every directory that contains source code must have a `README.md`.
- Update the README when you change what's in the directory.
- READMEs must include: purpose, what belongs here, file list with one-line descriptions, and any directory-specific conventions.
- Do not duplicate `STANDARDS.md` content — link to it instead.
- Use JSDoc (`/** */`) on exported TypeScript functions/hooks where the purpose isn't obvious from the name.
- Use XML doc comments (`///`) on all public C# service interface members.

## What NOT to do

- No business logic in controllers
- No raw hex colors or magic numbers
- No `async void` — always `async Task`
- No `.Result` / `.Wait()` on async calls
- No unbounded list endpoints
- No logging of passwords, tokens, or PII
- No `export default` outside of page files
