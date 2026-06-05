using MindedConnections.Scheduling.Dtos.BlockedSlots;

namespace MindedConnections.Scheduling.Services.BlockedSlots;

public interface IBlockedSlotService
{
    Task<IReadOnlyList<BlockedSlotDto>> ListAsync(string tenantId, string providerId, DateTime from, DateTime to);
    Task<BlockedSlotDto> CreateAsync(string tenantId, string providerId, BlockSlotRequest request);
    Task<bool> DeleteAsync(string tenantId, string id, string requesterId, bool isAdmin);
}
