using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.Slots;
using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Services.Slots;

public class SlotService(SchedulingDbContext db) : ISlotService
{
    public async Task<IReadOnlyList<SlotDto>> GetAvailableAsync(
        string tenantId, string providerId, DateTime from, DateTime to)
    {
        var rules = await db.Availabilities
            .Where(a => a.TenantId == tenantId && a.ProviderId == providerId && a.IsActive)
            .ToListAsync();

        // Single query: all persisted slots in the window, keyed by start time.
        var persistedByStartTime = await db.TimeSlots
            .Where(s => s.TenantId == tenantId
                     && s.ProviderId == providerId
                     && s.StartsAt >= from
                     && s.StartsAt < to)
            .ToDictionaryAsync(s => s.StartsAt);

        var takenSlotIds = persistedByStartTime.Values
            .Where(s => s.Status != SlotStatus.Available)
            .Select(s => s.Id)
            .ToHashSet();

        var bookedSlotIds = await db.Appointments
            .Where(a => a.TenantId == tenantId
                     && a.ProviderId == providerId
                     && a.Status == AppointmentStatus.Scheduled)
            .Select(a => a.TimeSlotId)
            .ToHashSetAsync();

        // Load blocked windows for this provider — used to exclude overlapping slots.
        var blocks = await db.BlockedSlots
            .Where(b => b.TenantId == tenantId
                     && b.ProviderId == providerId
                     && b.EndsAt > from
                     && b.StartsAt < to)
            .Select(b => new { b.StartsAt, b.EndsAt })
            .ToListAsync();

        var cutoff = DateTime.UtcNow;
        var results = new List<SlotDto>();

        foreach (var rule in rules)
        {
            var maxDate     = cutoff.AddDays(rule.MaxAdvanceBookingDays).Date;
            var effectiveTo = to.Date > maxDate ? maxDate.AddDays(1) : to.Date.AddDays(1);
            var current     = from.Date;

            while (current < effectiveTo)
            {
                if (current.DayOfWeek == rule.DayOfWeek)
                {
                    var slotStart = current.Add(rule.StartTime.ToTimeSpan());
                    var dayEnd    = current.Add(rule.EndTime.ToTimeSpan());
                    var step      = rule.SlotDurationMin + rule.BufferTimeMin;

                    while (slotStart.AddMinutes(rule.SlotDurationMin) <= dayEnd)
                    {
                        var slotEnd = slotStart.AddMinutes(rule.SlotDurationMin);

                        var isBlocked = blocks.Any(b => b.StartsAt < slotEnd && b.EndsAt > slotStart);
                        if (!isBlocked)
                        {
                            persistedByStartTime.TryGetValue(slotStart, out var persistedSlot);

                            if (persistedSlot is null || (
                                !takenSlotIds.Contains(persistedSlot.Id) &&
                                !bookedSlotIds.Contains(persistedSlot.Id)))
                            {
                                var id = persistedSlot?.Id ?? $"{rule.Id}:{slotStart:O}";
                                results.Add(new SlotDto(id, providerId, slotStart, slotEnd));
                            }
                        }

                        slotStart = slotStart.AddMinutes(step);
                    }
                }

                current = current.AddDays(1);
            }
        }

        return results.OrderBy(s => s.StartsAt).ToList();
    }
}
