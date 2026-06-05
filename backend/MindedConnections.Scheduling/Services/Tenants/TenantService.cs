using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.Tenants;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Models;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Services.Tenants;

public class TenantService(SchedulingDbContext db, ILogger<TenantService> logger) : ITenantService
{
    public async Task<IReadOnlyList<TenantDto>> ListAsync()
    {
        return await db.Tenants
            .OrderBy(t => t.Name)
            .Select(t => new TenantDto(t.Id, t.Name, t.Slug, t.IsActive, t.CreatedAt))
            .ToListAsync();
    }

    public async Task<CreateTenantResponse> CreateAsync(CreateTenantRequest request)
    {
        var exists = await db.Tenants.AnyAsync(t => t.Slug == request.Slug);
        if (exists)
            throw new ConflictException($"A tenant with slug '{request.Slug}' already exists.");

        var plainKey = GenerateApiKey();
        var tenant = new Tenant
        {
            Name       = request.Name,
            Slug       = request.Slug,
            ApiKeyHash = TenantMiddleware.ComputeHash(plainKey),
        };

        db.Tenants.Add(tenant);
        await db.SaveChangesAsync();

        logger.LogInformation("Tenant {TenantId} ({Slug}) created", tenant.Id, tenant.Slug);

        var dto = new TenantDto(tenant.Id, tenant.Name, tenant.Slug, tenant.IsActive, tenant.CreatedAt);
        return new CreateTenantResponse(dto, plainKey);
    }

    public async Task<bool> DeactivateAsync(string tenantId)
    {
        var tenant = await db.Tenants.FindAsync(tenantId);
        if (tenant is null) return false;

        tenant.IsActive = false;
        await db.SaveChangesAsync();

        logger.LogInformation("Tenant {TenantId} deactivated", tenantId);
        return true;
    }

    private static string GenerateApiKey() =>
        $"sk_{Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32))
            .Replace("+", "-").Replace("/", "_").TrimEnd('=')}";
}
