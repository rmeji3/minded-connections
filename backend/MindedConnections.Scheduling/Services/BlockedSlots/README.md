# Services/BlockedSlots

Manages provider-defined unavailability windows. Slots overlapping a blocked range are hidden from the public slot listing.

## What belongs here

Blocked slot CRUD. The `SlotService` consumes blocked slot data — it does not live here.

## Files

| File | Purpose |
|---|---|
| `IBlockedSlotService.cs` | Interface |
| `BlockedSlotService.cs` | Implementation — list, create, delete with ownership check |

## How slot exclusion works

`SlotService.GetAvailableAsync` loads all blocked windows for the requested provider + date range in one query, then uses an in-memory overlap check (`block.StartsAt < slotEnd && block.EndsAt > slotStart`) before emitting each slot.

## Authorization

- Providers can only create/delete their own blocks.
- Admins can create/delete any provider's blocks (via `?providerId=` on `POST`).
- Deleting a block does not reinstate or notify about existing appointments — it only makes the slot visible for future booking.
