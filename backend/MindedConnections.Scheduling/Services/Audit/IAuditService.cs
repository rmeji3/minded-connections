namespace MindedConnections.Scheduling.Services.Audit;

public interface IAuditService
{
    /// <summary>
    /// Records an auditable action. Fire-and-forget safe — failures are logged but never propagate.
    /// </summary>
    Task LogAsync(
        string tenantId,
        string actorId,
        string actorRole,
        string entityType,
        string entityId,
        string action,
        object? metadata = null);
}
