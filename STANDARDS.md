# Code & Component Standards

> Agents and contributors must follow these standards when producing any output for this project.
> Read `AGENTS.md` first for Next.js version notes, then apply everything below.

---

## 1. Components

### Structure
- One component per file. File name matches the component in kebab-case: `book-form.tsx` → `BookForm`.
- **Named exports only** — no default exports except for Next.js `page.tsx` files (required by the router).
- Co-locate props interface in the same file, directly above the component.

```tsx
// ✅ correct
interface HeroProps {
  headline: string;
}

export function Hero({ headline }: HeroProps) { … }

// ❌ wrong — default export in a non-page file
export default function Hero() { … }
```

### Client vs Server
- Components are **Server Components by default**. Add `"use client"` only when the component uses:
  - Browser APIs (`window`, `IntersectionObserver`, event handlers)
  - React state or effects (`useState`, `useEffect`, `useRef`)
  - Interactivity driven by user input
- Keep `"use client"` components as small as possible; push server-renderable markup up the tree.

### Composition
- Pages compose named section components. Sections do not nest other sections.
- Pass data down as props; do not import page-level state into leaf components.
- Use the `asChild` / Radix `Slot` pattern when a component must render as a different element (see `Button`).

### Reuse
- Before creating a new component, check `components/ui/` and `components/sections/`.
- Generic, reusable primitives belong in `components/ui/`. Page-specific sections belong in `components/sections/`. Portal-only components go directly in `components/`.
- Use `<Reveal>` for any content that should animate in on scroll — do not reimplement `IntersectionObserver` inline.

---

## 2. TypeScript

- Always type props with an `interface`. Use `type` only for unions, mapped types, or aliases.
- Prefer specific HTML element types: `React.ButtonHTMLAttributes<HTMLButtonElement>` over `React.HTMLAttributes<HTMLElement>`.
- Use union string literals for finite sets of values:

```ts
type Variant = "primary" | "light" | "text" | "text-dark" | "phone";
```

- Use `Record<Key, Value>` for lookup maps:

```ts
const variantClass: Record<Variant, string> = { primary: "btn-primary", … };
```

- Prefer `React.useState<ExplicitType>` over letting TypeScript infer from an ambiguous initial value.
- Do not use `any`. Use `unknown` and narrow it, or create a proper interface.

---

## 3. Styling

### Ground rules
- **Tailwind first**: reach for Tailwind utility classes as the default. Only introduce a custom CSS class in `globals.css` when a pattern is repeated across 3 or more places, or when it requires design-token values that cannot be expressed cleanly as Tailwind utilities.
- Do not inline raw colour values or hard-coded pixel sizes. Use the design tokens:

| Token family | Example |
|---|---|
| Colours | `var(--sage-500)`, `var(--color-focus)` |
| Spacing | `var(--sp-4)` |
| Type scale | `var(--text-lg)` |
| Shadows | `var(--shadow-md)` |

### Class naming
- BEM-influenced, flat naming: `.btn-primary`, `.form-field`, `.section-head`.
- Modifier suffix separated by `--`: `.btn-text--on-dark`, `.section--cream`.
- State via data attributes or ARIA, not JS-toggled class prefixes: `[data-state="scrolled"]`, `[aria-expanded="true"]`.

### Tailwind usage
- **Tailwind is the primary styling tool.** Use it for layout, spacing, sizing, color, typography, borders, shadows, and all other visual properties unless a token-based custom class already exists for that exact pattern.
- Prefer Tailwind utilities over writing new CSS. Only add to `globals.css` when:
  1. The same combination of utilities appears in 3 or more components (extract to a custom class), or
  2. A brand token value (e.g. `var(--sage-500)`) cannot be expressed via a Tailwind utility.
- Merge conflicting classes with the `cn()` helper from `lib/utils`:

```ts
import { cn } from "@/lib/utils";
className={cn("btn-primary", size === "sm" && "btn-sm", className)}
```

- Never repeat long Tailwind strings across files — extract them into a CSS class in `globals.css`.

### Responsive design
- Mobile-first. Base styles target mobile; use Tailwind breakpoint prefixes (`md:`, `lg:`) to layer up.
- Do not add arbitrary breakpoint values when the existing Tailwind scale suffices.

---

## 4. File & Folder Conventions

```
app/
  page.tsx               ← default export, composes sections
  layout.tsx             ← root layout
  <route>/
    page.tsx

components/
  ui/                    ← generic primitives (Button, Input, Accordion…)
  sections/              ← page sections (Hero, BookForm, TrustBar…)
  <feature>.tsx          ← portal-level or cross-cutting components

lib/
  utils.ts               ← shared pure utilities (cn, formatters…)
```

- File names: **kebab-case** (`portal-header.tsx`).
- Route folders: **lowercase**, matching the URL slug.
- No barrel `index.ts` files unless the folder exports ≥ 5 items.

---

## 5. Imports

Order (enforced mentally, not yet by a linter rule):

1. React / Next.js core (`import * as React from "react"`, `import Link from "next/link"`)
2. Third-party packages (`import { clsx } from "clsx"`)
3. Internal components (`@/components/…`)
4. Internal utilities / lib (`@/lib/…`)
5. Types (if not co-located)

Always use the `@/` path alias — never relative `../../` paths.

---

## 6. Forms

- No form library. Use native `<form>` with the `FormData` API.
- Validate client-side with local state before submission.
- Surface feedback through accessible markup:

```tsx
<div role="status" aria-live="polite">…</div>
```

- Label every field with `<label htmlFor="…">` or an `aria-label`.

---

## 7. Accessibility

This project targets **WCAG 2.1 AA** compliance at minimum.

### Semantics & Structure
- Use semantic HTML first (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`) before reaching for a `<div>`.
- Every page must have exactly one `<h1>`. Heading levels must not skip (`h1 → h2 → h3`, never `h1 → h3`).
- Landmark regions (`<header>`, `<main>`, `<footer>`, `<nav>`) must be present on every page.

### Keyboard & Focus
- Every interactive element must be reachable by keyboard in a logical tab order.
- Visible focus ring is required on all focusable elements — never do `outline: none` without a replacement `:focus-visible` style.
- Modal dialogs must trap focus; closing must return focus to the trigger element.
- Escape key must close any modal, drawer, or popover.

### Color & Contrast
- Text must meet a **4.5 : 1** contrast ratio against its background (AA). Large text (≥ 18 pt / 14 pt bold) requires **3 : 1**.
- Never convey information by color alone — pair color with an icon, label, or pattern.

### Images & Media
- Meaningful images: always supply a descriptive `alt` attribute.
- Decorative images: `alt=""`.
- Icons used as buttons must have an `aria-label` or visually-hidden label text.

### ARIA
- Use ARIA only when native semantics cannot express the pattern.
- Prefer `role="status" aria-live="polite"` for non-urgent feedback; `aria-live="assertive"` only for errors that require immediate attention.
- Do not add ARIA roles that duplicate the implicit role of the element (e.g., `role="button"` on a `<button>`).

### Forms
- Every field must have a programmatically associated label (`<label htmlFor>` or `aria-label`).
- Validation errors must be announced to screen readers and visually associated with the field (`aria-describedby`).
- Required fields must be indicated both visually and with `aria-required="true"`.

---

## 8. UI / UX — Mobile & Desktop

### Philosophy
- Design for mobile first, then progressively enhance for larger screens.
- Every layout, interaction, and component must be fully usable on both mobile (≥ 320 px) and desktop (up to 1920 px).
- Prioritize clarity, legibility, and reduced cognitive load over visual decoration.

### Touch & Pointer Targets
- Minimum tap target size is **44 × 44 px** (WCAG 2.5.5). Apply padding rather than enlarging visible UI if needed.
- Avoid hover-only interactions. Any action revealed on hover must also be accessible via tap or focus.
- On mobile, prefer bottom-sheet or full-screen overlays over small dropdowns that are difficult to tap.

### Typography & Readability
- Body text minimum: **16 px** on mobile, **16–18 px** on desktop.
- Line length should stay between **60–80 characters** (`max-w-prose` or equivalent) for paragraph content.
- Sufficient line-height: at least **1.5 × font size** for body copy.

### Spacing & Density
- Use generous vertical rhythm on mobile — avoid cramped stacked elements.
- Increase information density progressively on wider screens; never just scale everything up proportionally.
- Section padding should increase at each major breakpoint (`py-16 md:py-24 lg:py-32`).

### Navigation
- Mobile: primary navigation must be accessible via a clearly labeled hamburger/menu button.
- Desktop: primary navigation should be visible in a horizontal nav bar without requiring an extra tap.
- Active states and current-page indicators must be visible at all breakpoints.

### Feedback & States
- Every interactive element must have clear `default`, `hover`, `focus`, `active`, and `disabled` states.
- Loading states must prevent double-submission and provide visible feedback (spinner, skeleton, or disabled button).
- Error and success states must be visually distinct and explained in plain language.

### Forms (UX)
- Stack form fields vertically on mobile; multi-column layouts are acceptable on `md:` and above.
- Show inline validation feedback as soon as a field loses focus — do not wait for final submit.
- Destructive actions (cancel, delete) require a confirmation step.

### Motion & Animation
- Respect `prefers-reduced-motion`. Wrap non-essential animations in a media query or the `<Reveal>` component's existing guard.
- Transitions should be fast (150–300 ms) and purposeful — do not animate for decoration alone.

---

## 9. Clean Code

- **No magic values** — name constants or use design tokens.
- **No commented-out code** — delete it; version control preserves history.
- **No dead imports** — remove unused imports before committing.
- Functions and components should do one thing. If a component exceeds ~150 lines, look for extraction opportunities.
- Prefer early returns over deeply nested conditionals.

```tsx
// ✅ early return
if (!isOpen) return null;
return <Dialog>…</Dialog>;

// ❌ nested
return isOpen ? <Dialog>…</Dialog> : null; // fine at leaf level, but avoid nesting
```

---

## 10. Performance

- Prefer Server Components for static or data-fetching work.
- Use `next/image` for all images (automatic optimisation, lazy loading, size hints via `width`/`height` or `fill`).
- Use `next/link` for all internal navigation.
- Do not import an entire library to use one function — import named exports or the specific sub-path.

---

## 11. What NOT to do

| Pattern | Why |
|---|---|
| Inline `style={{ color: "#4a7c59" }}` | Bypasses design tokens |
| `export default` in non-page files | Breaks consistent import ergonomics |
| Adding `"use client"` to a layout or page when only a child needs it | Forces unnecessary client bundle |
| Duplicating CSS that already exists in `globals.css` | Creates drift between token system and actual styles |
| Importing from `react` as `import React from "react"` | Use namespace import: `import * as React from "react"` |
| Creating a new UI primitive instead of using/extending `components/ui/` | Fragments the component library |

---

---

# Backend Standards (ASP.NET Core)

---

## 12. Architecture — Fat Service / Thin Controller

Controllers are **routing and HTTP translation only**. All business logic lives in services.

### Controller rules
- One controller per resource (`UsersController`, `AppointmentsController`).
- Actions must not contain business logic, query building, or EF calls — delegate everything to the injected service.
- Actions should be ≤ 15 lines. If longer, something belongs in the service.
- Catch only typed domain exceptions and map them to HTTP responses:

```csharp
// ✅ correct
[HttpPost]
public async Task<IActionResult> Create(CreateProviderRequest req)
{
    try
    {
        var user = await _users.CreateProviderAsync(req);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }
    catch (ValidationException ex) { return BadRequest(new { errors = ex.Errors }); }
    catch (ConflictException ex)   { return Conflict(new { error = ex.Message }); }
}

// ❌ wrong — business logic in controller
[HttpPost]
public async Task<IActionResult> Create(CreateProviderRequest req)
{
    var existing = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
    if (existing != null) return Conflict("Email already taken.");
    // ...
}
```

### Service rules
- One interface + one implementation per domain area: `IUsersService` / `UsersService`.
- Place each service pair in its own subfolder: `Services/Users/`, `Services/Auth/`, `Services/Scheduling/`.
- Services own all domain logic: validation, EF queries, Identity calls, external integrations.
- Services throw typed exceptions (`ValidationException`, `NotFoundException`, `ConflictException`, `UnauthorizedException`) — never return raw HTTP status codes.
- Inject `ILogger<TService>` in every service; log meaningful events (see §14).

### Shared project
- DTOs, query objects, response wrappers, and domain exceptions live in `MindedConnections.Shared`.
- Never reference the API project from the Shared project (one-way dependency).

---

## 13. Pagination

Every list endpoint that may return more than 20 records **must** be paginated.

### Query objects
Inherit from the shared `PaginatedQuery` base; add domain-specific filters as properties:

```csharp
public record UserListQuery : PaginatedQuery
{
    public string? Role   { get; init; }
    public string? Search { get; init; }
}
```

`PaginatedQuery` provides:
- `SafePage` — clamped to ≥ 1
- `SafePageSize` — clamped to `[1, MaxPageSize]` (override `MaxPageSize` per domain)
- `Skip` — pre-computed offset for EF `Skip()`

### Response wrapper
All paginated responses use `PagedResponse<T>`:

```csharp
public record PagedResponse<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int Total,
    int TotalPages,
    bool HasNext,
    bool HasPrev
);
```

### Rules
- Default `PageSize` is **20**; maximum is **100** (enforce in `SafePageSize`).
- Never return unbounded lists — if a caller omits pagination params, apply the defaults.
- Apply filters before counting: `Total` must reflect the filtered set, not the whole table.
- Use `CountAsync()` + `Skip().Take().ToListAsync()` — never load then slice in memory.

---

## 14. Logging (Serilog)

### What to log

| Event | Level | Required context |
|---|---|---|
| Successful login | `Information` | `UserId`, `Email` |
| Failed login attempt | `Warning` | `Email`, reason |
| Account locked / suspicious activity | `Warning` | `Email`, IP |
| User created / deleted | `Information` | `ActorId`, `TargetUserId`, role |
| Token refreshed | `Debug` | `UserId` |
| Token rejected / expired | `Warning` | reason |
| Unhandled exception | `Error` | full exception |
| App startup / shutdown | `Information` | — |
| Health check hits | `Debug` | — |

### How to log
- Use structured logging — **never** string-interpolate into the message template:

```csharp
// ✅ correct
_logger.LogInformation("User {UserId} created provider account {TargetEmail}", actorId, email);

// ❌ wrong
_logger.LogInformation($"User {actorId} created provider account {email}");
```

- Enrich every request with `UserId` via the Serilog middleware enricher; do not repeat it manually on every log call.
- Log at the service layer, not in controllers.
- Do not log passwords, tokens, or PII beyond what is necessary for audit purposes.

### Configuration
- Development: `Debug` minimum, EF command logging `Information`, console sink with ANSI theme.
- Production: `Information` minimum, rolling file sink (daily, 14-day retention), structured JSON output.
- Use `appsettings.json` overrides — never hard-code log levels in `Program.cs`.

---

## 15. Rate Limiting

Every public-facing or auth endpoint must be rate-limited. Use ASP.NET Core's built-in `RateLimiter` middleware (`.NET 7+`).

### Policies

| Policy name | Applies to | Window | Limit | Queue |
|---|---|---|---|---|
| `auth` | `/auth/login`, `/auth/refresh` | 1 minute | 10 requests | 0 |
| `api-global` | All other authenticated routes | 1 minute | 120 requests | 5 |
| `admin` | `/admin/*`, `/users/*` | 1 minute | 60 requests | 2 |

### Rules
- Define policies in `Program.cs` via `builder.Services.AddRateLimiter(…)`.
- Apply `[EnableRateLimiting("auth")]` to auth endpoints; apply the global policy via `app.UseRateLimiter()` on the pipeline.
- Return `429 Too Many Requests` with a `Retry-After` header.
- Log rate limit hits at `Warning` level with the client IP and endpoint.

```csharp
options.OnRejected = async (context, ct) =>
{
    context.HttpContext.Response.StatusCode = 429;
    var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogWarning("Rate limit exceeded for {IP} on {Path}",
        context.HttpContext.Connection.RemoteIpAddress,
        context.HttpContext.Request.Path);
    await context.HttpContext.Response.WriteAsync("Too many requests. Please try again later.", ct);
};
```

---

## 16. Validation

### Input validation
- Use `[ApiController]` — model binding errors automatically return `400` with a `ValidationProblemDetails` body; do not re-validate binding in the action.
- For domain-level rules (email uniqueness, business constraints) throw `ValidationException` from the service.
- Use `FluentValidation` for complex validators; register via `AddFluentValidation()` and keep validator classes co-located with their request DTOs.

### Domain exceptions → HTTP mapping

| Exception | HTTP status |
|---|---|
| `ValidationException` | `400 Bad Request` |
| `UnauthorizedException` | `401 Unauthorized` |
| `ForbiddenException` | `403 Forbidden` |
| `NotFoundException` | `404 Not Found` |
| `ConflictException` | `409 Conflict` |

- Map exceptions in the controller `catch` block or via a global `IExceptionHandler` middleware — never swallow them silently.

---

## 17. Security

- **Never** store plaintext passwords; always use `UserManager<AppUser>` (PBKDF2 by default).
- JWT secrets must be ≥ 32 characters; store them in `appsettings.Development.json` (gitignored) or environment variables — never in `appsettings.json`.
- Access tokens expire in **15 minutes**; refresh tokens expire in **7 days** and rotate on every use.
- Revoke all refresh tokens on logout and on password change.
- Enable CORS only for known origins; never use `AllowAnyOrigin` in production.
- Sensitive config (`Jwt:Secret`, connection strings, seed credentials) must never be committed to source control. Use `appsettings.Development.json` (gitignored) locally and environment variables / secrets manager in production.
- HTTPS only in production (`app.UseHttpsRedirection()`).

---

## 18. Database / Entity Framework

- Use **async** EF methods exclusively (`ToListAsync`, `FirstOrDefaultAsync`, `SaveChangesAsync`).
- Never call `SaveChangesAsync` inside a loop — batch changes, then save once.
- Use explicit `Select()` projections for list queries; do not return full entity graphs to the API layer.
- Keep migrations in the API project under `Migrations/`; commit every migration.
- Never run `EnsureCreated` in production — always use `MigrateAsync` at startup.
- Index foreign keys and any column used in `WHERE` / `ORDER BY` clauses in queries that run frequently.

---

## 19. Project Structure (Backend)

```
MindedConnections.sln
  MindedConnections.Api/
    Controllers/          ← thin controllers, one per resource
    Services/
      Auth/               ← IAuthService, AuthService
      Users/              ← IUsersService, UsersService
      Jwt/                ← IJwtService, JwtService
      Scheduling/         ← ISchedulingService, SchedulingService
    Middleware/           ← global exception handler, request enrichment
    Migrations/
    Program.cs
    appsettings.json
    appsettings.Development.json   ← gitignored

  MindedConnections.Shared/
    Dtos/                 ← request/response DTOs grouped by domain
    Queries/              ← PaginatedQuery, domain-specific query records
    Responses/            ← PagedResponse<T>, standard envelope types
    Exceptions/           ← ValidationException, NotFoundException, etc.
```

- One file per class. File name matches the class name.
- No logic in `Program.cs` beyond service registration and middleware pipeline setup.
- Extension methods (`AddUsersServices()`, `AddAuthServices()`) in dedicated static classes to keep `Program.cs` readable.

---

## 20. What NOT to do (Backend)

---

---

# Documentation Standards

---

## 21. README Requirements

Every directory that contains source code **must** have a `README.md`. This is enforced for humans and agents alike — an agent encountering an undocumented directory should create the README before adding code to it.

### Required README sections by directory type

**Package / project root** (`frontend/`, `backend/MindedConnections.Api/`, etc.)
- One-line purpose statement
- Tech stack with versions
- How to run locally (commands, env vars required)
- How to run tests
- Link to relevant sections of `STANDARDS.md`

**Feature directory** (`hooks/`, `lib/`, `Services/Users/`, etc.)
- One-line purpose statement
- What belongs here and what does not
- List of files with a one-line description of each
- Any conventions specific to this directory (naming, patterns used)

**Route/page directory** (`app/admin/`, `app/portal/patient/`, etc.)
- What route(s) this covers
- Auth requirement (public / role-gated)
- Data dependencies (which hooks/APIs the page uses)

### Rules
- READMEs are written in plain Markdown — no JSX, no code that needs to compile.
- Keep them short and scannable. Bullet points over paragraphs.
- **Update the README when you change the directory** — stale docs are worse than no docs.
- Do not duplicate the content of `STANDARDS.md` in a README — link to it instead.
- READMEs are excluded from linting and test coverage; they are documentation, not code.

### What NOT to put in a README
- Implementation details that belong in inline comments
- Secrets, credentials, or sample `.env` values with real data
- Changelog entries — use git commit messages for that

---

## 22. Inline Code Documentation

### TypeScript / React
- Export every public function, hook, and component with a JSDoc comment when its purpose is not obvious from the name and signature alone:

```ts
/**
 * Parses ASP.NET Identity error strings and routes them to the correct
 * form field or a general form-level error message.
 */
export function parseIdentityErrors(raw: string, fieldMap: …) { … }
```

- One-liner JSDoc is fine for simple utilities; skip it entirely for trivially named functions (`formatDate`, `cn`).
- Do not comment *what* the code does — comment *why* it does it when the reason is non-obvious.

### C# / ASP.NET
- Use XML doc comments (`///`) on all public service interface members:

```csharp
/// <summary>
/// Creates a new provider account and sends a welcome email.
/// Throws <see cref="ValidationException"/> if the email is already registered.
/// </summary>
Task<UserDto> CreateProviderAsync(CreateProviderRequest request);
```

- Controllers do not need XML docs — Swagger/OpenAPI picks up `[ProducesResponseType]` attributes instead.
- Use `// reason:` inline comments to explain non-obvious decisions (e.g. why a particular EF query is structured a certain way).

---

## 23. What NOT to do (Documentation)

| Pattern | Why |
|---|---|
| Skipping the README for a new directory | Next developer (or agent) has no context |
| Copying `STANDARDS.md` content into READMEs | Creates drift when standards change |
| Writing READMEs that describe obvious things (`"this folder contains hooks"`) | Noise; document the non-obvious |
| Leaving stale READMEs after refactors | Misleads more than no docs at all |
| Putting secrets or real env values in docs | Security risk |

| Pattern | Why |
|---|---|
| Business logic in controllers | Untestable, bloated, violates single responsibility |
| Raw SQL strings in application code | SQL injection risk; use EF parameterised queries |
| `async void` methods | Exceptions are unobservable; use `async Task` |
| `.Result` or `.Wait()` on async calls | Deadlocks in ASP.NET context; always `await` |
| Returning `IQueryable` from services | Leaks persistence concerns into callers |
| Logging sensitive data (passwords, tokens, PII) | Compliance and security violation |
| Hard-coding secrets in source files | Credential exposure in version control |
| Catching `Exception` and swallowing it | Hides bugs; only catch what you can handle |
| `ToList()` before `Where()` | Loads entire table into memory before filtering |
| Unbounded list endpoints | DoS risk and poor performance at scale |
