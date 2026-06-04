# hooks/

TanStack Query hooks. Every API interaction in the app goes through one of these — components never call `lib/` API functions directly.

## Files

| File | Exports | Purpose |
|---|---|---|
| `use-auth.ts` | `useAuth()` | Thin wrapper around `useAuthContext()` — exposes `user`, `isLoading`, `isAuthenticated`, `login`, `logout` |
| `use-login.ts` | `useLogin()` | Mutation — `POST /api/auth/login`. Returns `{ mutate, isPending, error }` |
| `use-users.ts` | `useUsers()`, `useUserStats()`, `useCreateProvider()`, `useCreatePatient()`, `useDeleteUser()` | All user management queries and mutations |
| `use-booking-flow.ts` | `useBookingFlow()` | Multi-step appointment booking state and mutations |

## Query key factory

`use-users.ts` exports `userKeys` — a structured query key factory used for targeted cache invalidation:

```ts
userKeys.all        // ["users"]
userKeys.lists()    // ["users", "list"]
userKeys.list(q)    // ["users", "list", { ...query }]
userKeys.stats()    // ["users", "stats"]
```

Mutations that modify users call `queryClient.invalidateQueries({ queryKey: userKeys.all })` on success so all user lists and stats refetch automatically.

## Conventions

- One file per domain area. Do not put unrelated hooks in the same file.
- Export the query key factory alongside the hooks so callers can invalidate precisely.
- Hooks must not contain JSX or component logic — they return data and mutation functions only.
- Error handling (toasts, field errors) belongs in the component's `onError` callback, not inside the hook.

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §1, §6.
