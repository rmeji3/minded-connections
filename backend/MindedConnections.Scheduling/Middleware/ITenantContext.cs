namespace MindedConnections.Scheduling.Middleware;

public interface ITenantContext
{
    string TenantId { get; }
}
