using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.BlockedSlots;
using MindedConnections.Scheduling.Models;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Services.BlockedSlots;

public class BlockedSlotService(SchedulingDbContext db, ILogger<BlockedSlotService> logger) : IBlockedSlotService
{
    public async Task<IReadOnlyList<BlockedSlotDto>> ListAsync(
        string tenantId, string providerId, DateTime from, DateTime to) =>
        await db.BlockedSlots
            .Where(b => b.TenantId == tenantId
                     && b.ProviderId == providerId
                     && b.EndsAt > from
                     && b.StartsAt < to)
            .OrderBy(b => b.StartsAt)
            .Select(b => ToDto(b))
            .ToListAsync();

    public async Task<BlockedSlotDto> CreateAsync(
        string tenantId, string providerId, BlockSlotRequest request)
    {
        if (request.EndsAt <= request.StartsAt)
            throw new ValidationException(["End time must be after start time."]);

        var block = new BlockedSlot
        {
            TenantId   = tenantId,
            ProviderId = providerId,
            StartsAt   = request.StartsAt.ToUniversalTime(),
            EndsAt     = request.EndsAt.ToUniversalTime(),
            Reason     = request.Reason,
        };
        db.BlockedSlots.Add(block);
        await db.SaveChangesAsync();

        logger.LogInformation("Blocked slot {Id} created for provider {ProviderId} {StartsAt}–{EndsAt}",
            block.Id, providerId, block.StartsAt, block.EndsAt);
        return ToDto(block);
    }

    public async Task<bool> DeleteAsync(string tenantId, string id, string requesterId, bool isAdmin)
    {
        var block = await db.BlockedSlots.FirstOrDefaultAsync(b => b.Id == id && b.TenantId == tenantId);
        if (block is null) return false;

        if (!isAdmin && block.ProviderId != requesterId)
            throw new ForbiddenException("You can only remove your own blocked slots.");

        db.BlockedSlots.Remove(block);
        await db.SaveChangesAsync();

        logger.LogInformation("Blocked slot {Id} removed by {RequesterId}", id, requesterId);
        return true;
    }

    private static BlockedSlotDto ToDto(BlockedSlot b) =>
        new(b.Id, b.ProviderId, b.StartsAt, b.EndsAt, b.Reason, b.CreatedAt);
}
