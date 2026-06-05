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
| Auth | Supabase Auth with server-side HttpOnly cookies via `@supabase/ssr` |

## Running locally

```bash
npm install
npm run dev    # http://localhost:3000
```

**Required `.env.local`:**
```
NEXT_PUBLIC_API_URL=/api
API_URL=http://localhost:5050
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Directory map

| Directory | README | Purpose |
|---|---|---|
| `app/` | [→](app/README.md) | All routes — pages, layouts, Route Handlers |
| `app/api/` | [→](app/api/README.md) | Backend proxy Route Handlers (login/logout handled via Supabase SDK client) |
| `app/admin/` | [→](app/admin/README.md) | Admin dashboard (role-gated) |
| `app/portal/` | [→](app/portal/README.md) | Patient + provider portals |
| `components/` | [→](components/README.md) | All reusable UI components |
| `contexts/` | [→](contexts/README.md) | React context providers |
| `hooks/` | [→](hooks/README.md) | TanStack Query data hooks |
| `lib/` | [→](lib/README.md) | API client, typed API functions, utilities, and Supabase server helper |

## Auth flow summary

1. **Authentication**: `POST /api/auth/login` uses `@supabase/ssr` server client to authenticate the user and stores the session securely in HttpOnly cookies on the Next.js origin (XSS-resistant).
2. **Session Persistence & Gating**: Next.js middleware (`proxy.ts`) intercepts requests, validates/refreshes the Supabase token using `getUser()`, and redirects unauthenticated users trying to access protected paths like `/admin` or `/portal`.
3. **API Proxy**: Backend API requests go through `proxyToBackend` in `frontend/lib/proxy-request.ts`. The proxy reads the active access token from the secure cookies and forwards it as a `Bearer` token to the .NET API. The browser client never handles the raw JWT token.

## Standards

Sections 1–11 of [`../STANDARDS.md`](../STANDARDS.md) apply to this project.
