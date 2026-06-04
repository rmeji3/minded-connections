# frontend

Next.js 16 application — patient portal, provider portal, admin dashboard, and public marketing site for MindEd Connections.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS design tokens (`globals.css`) |
| Data fetching | TanStack Query v5 |
| Notifications | Sonner |
| Auth | JWT access + refresh tokens via Route Handler proxy |

## Running locally

```bash
npm install
npm run dev    # http://localhost:3000
```

**Required `.env.local`:**
```
NEXT_PUBLIC_API_URL=/api
API_URL=http://localhost:5050
```

## Directory map

| Directory | README | Purpose |
|---|---|---|
| `app/` | [→](app/README.md) | All routes — pages, layouts, Route Handlers |
| `app/api/` | [→](app/api/README.md) | Backend proxy Route Handlers |
| `app/admin/` | [→](app/admin/README.md) | Admin dashboard (role-gated) |
| `app/portal/` | [→](app/portal/README.md) | Patient + provider portals |
| `components/` | [→](components/README.md) | All reusable UI components |
| `contexts/` | [→](contexts/README.md) | React context providers |
| `hooks/` | [→](hooks/README.md) | TanStack Query data hooks |
| `lib/` | [→](lib/README.md) | API client, typed API functions, utilities |

## Auth flow summary

1. `POST /api/auth/login` — Next.js Route Handler proxies to backend, re-issues `Set-Cookie` on the Next.js domain.
2. `has_session=1` sentinel cookie (non-HttpOnly) lets the client skip the refresh call when no session exists.
3. `middleware.ts` guards protected routes by checking for the `refresh_token` cookie.
4. Access tokens (15 min) are stored in module memory; refresh tokens (7 days) are HttpOnly cookies.

## Standards

Sections 1–11 of [`../STANDARDS.md`](../STANDARDS.md) apply to this project.
