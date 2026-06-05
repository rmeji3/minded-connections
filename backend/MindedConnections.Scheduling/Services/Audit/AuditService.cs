using System.Text.Json;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Services.Audit;

public class AuditService(SchedulingDbContext db, ILogger<AuditService> logger) : IAuditService
{
    public async Task LogAsync(
        string tenantId, string actorId, string actorRole,
        string entityType, string entityId, string action,
        object? metadata = null)
    {
        try
        {
            db.AuditLogs.Add(new AuditLog
            {
                TenantId   = tenantId,
                ActorId    = actorId,
                ActorRole  = actorRole,
                EntityType = entityType,
                EntityId   = entityId,
                Action     = action,
                Metadata   = metadata is null
                    ? null
                    : JsonSerializer.Serialize(metadata),
            });
            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Audit failures must never surface to callers — log and continue.
            logger.LogError(ex, "Failed to write audit log for {Action} on {EntityType}/{EntityId}", action, entityType, entityId);
        }
    }
}
