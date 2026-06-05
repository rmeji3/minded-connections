using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.ServiceTypes;
using MindedConnections.Scheduling.Models;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Services.ServiceTypes;

public class ServiceTypeService(SchedulingDbContext db, ILogger<ServiceTypeService> logger) : IServiceTypeService
{
    public async Task<IReadOnlyList<ServiceTypeDto>> ListAsync(string tenantId)
    {
        return await db.ServiceTypes
            .Where(st => st.TenantId == tenantId && st.IsActive)
            .OrderBy(st => st.Name)
            .Select(st => new ServiceTypeDto(st.Id, st.Name, st.DurationMin, st.IsActive, st.Price))
            .ToListAsync();
    }

    public async Task<ServiceTypeDto> CreateAsync(string tenantId, CreateServiceTypeRequest request)
    {
        var exists = await db.ServiceTypes.AnyAsync(st => st.TenantId == tenantId && st.Name == request.Name && st.IsActive);
        if (exists)
            throw new ConflictException($"A service type with name '{request.Name}' already exists.");

        var st = new ServiceType
        {
            TenantId = tenantId,
            Name = request.Name,
            DurationMin = request.DurationMin,
            Price = request.Price,
        };

        db.ServiceTypes.Add(st);
        await db.SaveChangesAsync();

        logger.LogInformation("ServiceType {Id} created for tenant {TenantId}", st.Id, tenantId);

        return new ServiceTypeDto(st.Id, st.Name, st.DurationMin, st.IsActive, st.Price);
    }

    public async Task<bool> DeactivateAsync(string tenantId, string id)
    {
        var st = await db.ServiceTypes.FirstOrDefaultAsync(s => s.Id == id && s.TenantId == tenantId);
        if (st is null) return false;

        st.IsActive = false;
        await db.SaveChangesAsync();

        logger.LogInformation("ServiceType {Id} deactivated for tenant {TenantId}", id, tenantId);
        return true;
    }
}
