# Services/Audit

Queryable write-trail for all domain events across the scheduling service.

## What belongs here

Write-trail logic only. This directory owns the `AuditLog` model's persistence. It does **not** own logging decisions — callers decide what to log; this service just persists it.

## What does NOT belong here

- Read-side audit queries exposed to the API (those would live in a future `AuditController` + query service).
- Application-level structured logs (use `ILogger` for those).

## Files

| File | Purpose |
|---|---|
| `IAuditService.cs` | Interface — single `LogAsync` method |
| `AuditService.cs` | Implementation — serialises metadata to JSON, persists to `audit_logs` table, swallows and logs failures so audit never surfaces to callers |

## Conventions

- `LogAsync` must never throw. If DB write fails, log at `Error` and return.
- `metadata` is any serialisable object. Keep it small — action-specific context only (old/new values, reasons).
- `entityType` values: `"Appointment"`, `"RecurringSeries"`, `"Availability"`, `"Tenant"`.
- `action` verbs: `"Booked"`, `"Cancelled"`, `"Rescheduled"`, `"Edited"`, `"StatusUpdated"`, `"Upserted"`, `"Deleted"`.
