# app/admin/

Admin dashboard. All routes in this subtree require the `Admin` role — `layout.tsx` redirects any other user to `/login`.

## Routes

| Route | Purpose |
|---|---|
| `/admin` | Overview — live user stats cards and quick-action links |
| `/admin/users` | Paginated user table with search and role filter |
| `/admin/users/providers/new` | Create a new provider account |
| `/admin/users/patients/new` | Create a new patient account |

## Data dependencies

| Page | Hook | API |
|---|---|---|
| `/admin` | `useUserStats()` | `GET /api/users/stats` |
| `/admin/users` | `useUsers(query)`, `useDeleteUser()` | `GET /api/users`, `DELETE /api/users/[id]` |
| `/admin/users/providers/new` | `useCreateProvider()` | `POST /api/users/providers` |
| `/admin/users/patients/new` | `useCreatePatient()` | `POST /api/users/patients` |

## Conventions

- URL state drives all filters and pagination (`?page=`, `?role=`, `?search=`) — no React state for those values.
- Destructive actions (delete user) require a `confirm()` dialog before firing the mutation.
- Success and error feedback uses Sonner toasts (`toast.success` / `toast.error`).
- Form validation runs client-side first; server Identity errors are parsed by `parseIdentityErrors()` and routed to the correct field.

## Shared components used

- `AdminSidebar` — sticky sidebar nav, rendered by `layout.tsx`
- `UserRoleBadge` — colour-coded role pill
- `Pagination` — compact paginator with ellipsis
- `FormField` — accessible label + error + hint wrapper

## Standards

[`../../../STANDARDS.md`](../../../STANDARDS.md) §1–9.
