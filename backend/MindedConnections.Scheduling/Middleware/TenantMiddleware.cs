using MindedConnections.Scheduling.Data;
using Microsoft.EntityFrameworkCore;

namespace MindedConnections.Scheduling.Middleware;

public class TenantMiddleware(RequestDelegate next)
{
    private const string ApiKeyHeader = "X-Api-Key";

    public async Task InvokeAsync(HttpContext context, SchedulingDbContext db)
    {
        // Health endpoint is public — no tenant required.
        if (context.Request.Path.StartsWithSegments("/health"))
        {
            await next(context);
            return;
        }

        if (!context.Request.Headers.TryGetValue(ApiKeyHeader, out var rawKey) || string.IsNullOrWhiteSpace(rawKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { error = "Missing X-Api-Key header." });
            return;
        }

        var keyHash = ComputeHash(rawKey!);
        var tenant  = await db.Tenants.FirstOrDefaultAsync(t => t.ApiKeyHash == keyHash && t.IsActive);

        if (tenant is null)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { error = "Invalid or inactive API key." });
            return;
        }

        context.Items["TenantId"] = tenant.Id;
        await next(context);
    }

    internal static string ComputeHash(string key)
    {
        var bytes = System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(key));
        return Convert.ToHexStringLower(bytes);
    }
}

/// <summary>
/// Scoped service populated by TenantMiddleware. Controllers and services depend on this.
/// </summary>
public class TenantContext : ITenantContext
{
    public string TenantId { get; set; } = default!;
}
