# app/portal/

Authenticated portal subtree. Split into separate role-specific routes — `/portal/patient` and `/portal/provider`. The root `/portal` page immediately redirects based on the logged-in user's role.

## Routes

| Route | Auth | Purpose |
|---|---|---|
| `/portal` | Any authenticated | Redirects → `/portal/patient` or `/portal/provider` |
| `/portal/patient` | Patient only | Patient dashboard — messages, tasks, mood chart, care team, next appointment |
| `/portal/provider` | Provider only | Provider dashboard — today's schedule, patient messages, action items |
| `/portal/appointments` | Patient | Appointment booking flow |

## Auth guards

- `app/portal/layout.tsx` — blocks Admin role, redirects unauthenticated users to `/login?next=/portal`.
- `app/portal/patient/layout.tsx` — allows Patient only; redirects others.
- `app/portal/provider/layout.tsx` — allows Provider only; redirects others.

## Status

Patient and provider dashboard pages currently render static/mock data. They are ready to be wired to real API endpoints once the scheduling and messaging services are built.

## Standards

[`../../../STANDARDS.md`](../../../STANDARDS.md) §1–9.
