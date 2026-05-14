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
