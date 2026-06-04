# components/

All reusable React components. Organised by scope:

## Subdirectories

### `ui/`
Generic, design-system-level primitives. No domain knowledge — these work anywhere in the app.

| File | Component | Purpose |
|---|---|---|
| `accordion.tsx` | `Accordion` | Collapsible content panel |
| `badge-chip.tsx` | `BadgeChip` | Small label chip |
| `button.tsx` | `Button` | Primary action button with variants |
| `dialog.tsx` | `Dialog` | Modal dialog with focus trap |
| `ghost-btn.tsx` | `GhostBtn` | Transparent/outline button variant |
| `input.tsx` | `Input` | Styled text input |
| `sonner.tsx` | `Toaster` | Sonner toast provider wrapper |

### `sections/`
Page-section components for the public marketing site. No auth or portal concerns.

### `admin/`
Components used exclusively within the admin dashboard.

| File | Component | Purpose |
|---|---|---|
| `admin-sidebar.tsx` | `AdminSidebar` | Sticky sidebar nav with active state and logout |
| `form-field.tsx` | `FormField` | Accessible label + error message + hint text wrapper |
| `pagination.tsx` | `Pagination` | Compact paginator — page buttons, ellipsis, "Showing X–Y of Z" |
| `user-role-badge.tsx` | `UserRoleBadge` | Colour-coded role pill (Admin / Provider / Patient) |

### `booking/`
Components for the patient appointment booking flow.

## Conventions

- Named exports only — no `export default`.
- Props interface co-located directly above the component.
- One component per file; file name is kebab-case matching the component name.
- Add `"use client"` only when the component uses state, effects, or browser APIs.
- Before adding a new component, check if an existing one in `ui/` can be extended.

## Standards

[`../../STANDARDS.md`](../../STANDARDS.md) §1–3.
