# app/api/

Next.js Route Handlers that proxy requests to the backend. These run server-side and are never bundled into the client.

**Why proxies?** Cookies set by `localhost:5050` (the backend) are scoped to that origin and invisible to `localhost:3000` (Next.js). Route Handlers re-issue `Set-Cookie` headers on the Next.js domain so the browser stores them correctly.

## Routes

| Route | Method | Proxies to | Notes |
|---|---|---|---|
| `/api/auth/login` | POST | `POST /auth/login` | Re-issues `refresh_token` + `has_session` cookies |
| `/api/auth/logout` | POST | `POST /auth/logout` | Clears both cookies (`Max-Age=0`) |
| `/api/auth/refresh` | POST | `POST /auth/refresh` | Rotates refresh token, re-issues cookies |
| `/api/auth/me` | GET | `GET /auth/me` | Returns current user info |
| `/api/users` | GET | `GET /users` | Paginated user list |
| `/api/users/stats` | GET | `GET /users/stats` | Aggregate stats for admin dashboard |
| `/api/users/[id]` | DELETE | `DELETE /users/:id` | Delete a user |
| `/api/users/providers` | POST | `POST /users/providers` | Create provider account |
| `/api/users/patients` | POST | `POST /users/patients` | Create patient account |

## Cookie strategy

- `refresh_token` — HttpOnly, `Path=/`, `SameSite=Strict`. Rewritten from `Path=/auth` (backend default) by `proxy-request.ts`.
- `has_session=1` — non-HttpOnly, `Path=/`. Lets client-side code detect an active session before attempting a refresh, avoiding a noisy 401 on every page load when logged out.

## `proxy-request.ts`

Server-only helper used by every Route Handler. Forwards the incoming request to the backend, rewrites `Set-Cookie` paths, and appends the `has_session` sentinel. Import from `@/lib/proxy-request`.

## Standards

[`../../../STANDARDS.md`](../../../STANDARDS.md) §5, §17.
