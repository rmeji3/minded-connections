# contexts/

React context providers. Each context owns one domain of shared state that needs to be accessible across the component tree without prop-drilling.

## Files

| File | Export | Purpose |
|---|---|---|
| `auth-context.tsx` | `AuthProvider`, `useAuthContext` | Global auth state — current user, loading flag, login/logout actions |

## `AuthProvider`

Wraps the app at the root layout level (via `components/providers.tsx`). On mount it calls `refreshSession()` to restore a session from the existing refresh token cookie, guarded by the `has_session=1` sentinel to avoid a noisy 401 when no session exists.

Exposes:
- `user: AuthUser | null`
- `isLoading: boolean` — true during the initial session restore
- `isAuthenticated: boolean`
- `login(user)` — sets user state after a successful login mutation
- `logout()` — calls the logout API and clears user state

## Conventions

- Contexts are consumed through a dedicated hook (`use-auth.ts`) — never import `useAuthContext` directly in components.
- Keep contexts focused on a single domain. Do not create a "global app state" mega-context.
- Context providers must not contain data-fetching logic — delegate to hooks and pass data down.

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §1.
