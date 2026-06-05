# Services/CareRelationships

Manages the patient–provider care relationship, which controls which providers a patient can book with.

## What belongs here

Care relationship CRUD and the `ExistsAsync` gate used by `AppointmentService`.

## Files

| File | Purpose |
|---|---|
| `ICareRelationshipService.cs` | Interface |
| `CareRelationshipService.cs` | Implementation — list, assign, ensure (auto-create), deactivate |

## Rules

- **Initial Consultation**: no prior relationship required. `AppointmentService` calls `EnsureAsync` after a successful Initial Consultation booking to auto-create the relationship.
- **All other visit types**: `AppointmentService` calls `ExistsAsync` before booking. Returns `403` if no active relationship.
- **Unique constraint**: `(tenant_id, patient_id, provider_id)` is unique. Re-assigning a deactivated relationship reactivates it rather than creating a duplicate.
- Only Admins can manually assign or remove relationships via the API (`POST /care-relationships`, `DELETE /care-relationships/{id}`).
