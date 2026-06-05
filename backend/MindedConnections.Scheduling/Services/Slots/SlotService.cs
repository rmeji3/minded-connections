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

        // Existing booked/blocked time slots in the requested window.
        var takenSlotIds = await db.TimeSlots
            .Where(s => s.TenantId == tenantId
                     && s.ProviderId == providerId
                     && s.StartsAt >= from
                     && s.StartsAt < to
                     && s.Status != SlotStatus.Available)
            .Select(s => s.Id)
            .ToHashSetAsync();

        // Also exclude slots that already have appointments (double-check via Appointments table).
        var bookedSlotIds = await db.Appointments
            .Where(a => a.TenantId == tenantId
                     && a.ProviderId == providerId
                     && a.Status == AppointmentStatus.Scheduled)
            .Select(a => a.TimeSlotId)
            .ToHashSetAsync();

        var cutoff = DateTime.UtcNow;
        var results = new List<SlotDto>();

        foreach (var rule in rules)
        {
            var maxDate = cutoff.AddDays(rule.MaxAdvanceBookingDays).Date;
            var effectiveTo = to.Date > maxDate ? maxDate.AddDays(1) : to.Date.AddDays(1);
            var current = from.Date;

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

                        // Check if there is a persisted TimeSlot record for this window.
                        var persistedSlot = await db.TimeSlots.FirstOrDefaultAsync(s =>
                            s.TenantId   == tenantId &&
                            s.ProviderId == providerId &&
                            s.StartsAt   == slotStart);

                        if (persistedSlot is null || (
                            !takenSlotIds.Contains(persistedSlot.Id) &&
                            !bookedSlotIds.Contains(persistedSlot.Id)))
                        {
                            var id = persistedSlot?.Id ?? $"{providerId}:{slotStart:O}";
                            results.Add(new SlotDto(id, providerId, slotStart, slotEnd));
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
