using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.Availability;
using MindedConnections.Scheduling.Models;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Services.Availability;

public class AvailabilityService(SchedulingDbContext db, ILogger<AvailabilityService> logger) : IAvailabilityService
{
    public async Task<IReadOnlyList<AvailabilityDto>> GetByProviderAsync(string tenantId, string providerId)
    {
        return await db.Availabilities
            .Where(a => a.TenantId == tenantId && a.ProviderId == providerId)
            .OrderBy(a => a.DayOfWeek)
            .Select(a => ToDto(a))
            .ToListAsync();
    }

    public async Task<AvailabilityDto> UpsertAsync(
        string tenantId, string providerId, DayOfWeek day, UpsertAvailabilityRequest request)
    {
        if (request.EndTime <= request.StartTime)
            throw new ValidationException(["End time must be after start time."]);

        var existing = await db.Availabilities
            .FirstOrDefaultAsync(a => a.TenantId == tenantId && a.ProviderId == providerId && a.DayOfWeek == day);

        if (existing is null)
        {
            existing = new Models.Availability
            {
                TenantId   = tenantId,
                ProviderId = providerId,
                DayOfWeek  = day,
            };
            db.Availabilities.Add(existing);
        }

        existing.StartTime             = request.StartTime;
        existing.EndTime               = request.EndTime;
        existing.SlotDurationMin       = request.SlotDurationMin;
        existing.BufferTimeMin         = request.BufferTimeMin;
        existing.MaxAdvanceBookingDays = request.MaxAdvanceBookingDays;
        existing.IsActive              = request.IsActive;

        await db.SaveChangesAsync();

        logger.LogInformation("Availability upserted for provider {ProviderId} on {Day}", providerId, day);
        return ToDto(existing);
    }

    public async Task<bool> DeleteAsync(string tenantId, string providerId, DayOfWeek day)
    {
        var existing = await db.Availabilities
            .FirstOrDefaultAsync(a => a.TenantId == tenantId && a.ProviderId == providerId && a.DayOfWeek == day);

        if (existing is null) return false;

        db.Availabilities.Remove(existing);
        await db.SaveChangesAsync();

        logger.LogInformation("Availability removed for provider {ProviderId} on {Day}", providerId, day);
        return true;
    }

    private static AvailabilityDto ToDto(Models.Availability a) => new(
        a.Id, a.ProviderId, a.DayOfWeek,
        a.StartTime, a.EndTime,
        a.SlotDurationMin, a.BufferTimeMin,
        a.MaxAdvanceBookingDays, a.IsActive
    );
}
