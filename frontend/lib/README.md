# lib/

Pure utilities and typed API functions. No React — nothing in here imports hooks or components.

## Files

| File | Purpose |
|---|---|
| `api-client.ts` | Base `apiRequest()` fetch wrapper. Stores the access token in module memory, auto-refreshes on `401`, parses error shapes from the backend. |
| `auth-api.ts` | Typed functions for auth endpoints: `loginRequest`, `logoutRequest`, `refreshSession`, `getMeRequest`. |
| `users-api.ts` | Typed functions for user management: `fetchUsers`, `fetchUserStats`, `fetchUser`, `createProvider`, `createPatient`, `deleteUser`. |
| `proxy-request.ts` | **Server-only.** Used by Route Handlers to forward requests to the backend and rewrite `Set-Cookie` headers. |
| `identity-errors.ts` | `parseIdentityErrors()` — maps ASP.NET Identity error strings to form field keys or a general form-level error. |
| `appointments-api.ts` | Typed functions for the scheduling service (in progress). |
| `appointments-types.ts` | TypeScript types for appointment-related data. |
| `utils.ts` | `cn()` — Tailwind class merge utility. Shared pure formatters. |

## `api-client.ts` — key behaviours

- Access token stored in module-level variable (cleared on logout).
- On `401`, automatically calls `POST /api/auth/refresh` once and retries the original request.
- Parses backend errors in three shapes: `{ error: string }`, `{ message: string }`, `{ errors: string[] | Record<string,string[]> }`.
- Throws `ApiError` (extends `Error`) with `.message` and `.status` — catch this in mutation `onError` handlers.

## `proxy-request.ts` — key behaviours

- Import only in Route Handler files (`app/api/**`). Never import in client components.
- Rewrites `Path=/auth` → `Path=/` on the `refresh_token` cookie so middleware can read it.
- Appends `has_session=1; Path=/; SameSite=Strict; Max-Age=604800` on every successful auth response.

## Conventions

- Functions are named exports — no default exports.
- No side effects at module load time (exception: `api-client.ts` module-level token variable is intentional).
- All API functions are `async` and return typed results or throw `ApiError`.

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §2, §5, §9.
