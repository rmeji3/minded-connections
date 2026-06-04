# app/

Next.js App Router directory. Every folder is a route segment; every `page.tsx` is a page; every `layout.tsx` wraps its subtree.

## Route map

| Route | Auth | Purpose |
|---|---|---|
| `/` | Public | Marketing homepage |
| `/login` | Public | Sign-in page (redirects by role on success) |
| `/admin` | Admin only | Admin dashboard — stats overview |
| `/admin/users` | Admin only | Paginated user list with search + role filter |
| `/admin/users/providers/new` | Admin only | Create provider account |
| `/admin/users/patients/new` | Admin only | Create patient account |
| `/portal/patient` | Patient only | Patient dashboard |
| `/portal/provider` | Provider only | Provider dashboard |
| `/portal/appointments` | Patient | Appointment booking flow |
| `/api/auth/*` | — | Route Handler proxies for auth (login, logout, refresh, me) |
| `/api/users/*` | — | Route Handler proxies for user management |

## Conventions

- `page.tsx` — default export (required by Next.js router), composes named section components.
- `layout.tsx` — wraps a route subtree; handles auth guards and shared chrome.
- `loading.tsx` — optional Suspense boundary shown while a page streams.
- Route Handlers live under `app/api/` — these are server-only and never rendered.
- Add `"use client"` only to interactive leaf components, never to layouts or pages directly.

## Auth guards

- `app/admin/layout.tsx` — redirects non-Admin users to `/login`.
- `app/portal/patient/layout.tsx` — redirects non-Patient users.
- `app/portal/provider/layout.tsx` — redirects non-Provider users.
- `middleware.ts` (repo root of frontend) — checks for `refresh_token` cookie on all protected paths.

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §1, §4.
