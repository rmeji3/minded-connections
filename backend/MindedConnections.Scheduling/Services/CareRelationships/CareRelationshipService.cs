using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.CareRelationships;
using MindedConnections.Scheduling.Models;
using MindedConnections.Shared.Exceptions;

namespace MindedConnections.Scheduling.Services.CareRelationships;

public class CareRelationshipService(SchedulingDbContext db, ILogger<CareRelationshipService> logger) : ICareRelationshipService
{
    public Task<bool> ExistsAsync(string tenantId, string patientId, string providerId) =>
        db.CareRelationships.AnyAsync(r =>
            r.TenantId == tenantId &&
            r.PatientId == patientId &&
            r.ProviderId == providerId &&
            r.IsActive);

    public async Task<IReadOnlyList<CareRelationshipDto>> ListAsync(
        string tenantId, string? patientId, string? providerId)
    {
        var q = db.CareRelationships.Where(r => r.TenantId == tenantId && r.IsActive);
        if (patientId  is not null) q = q.Where(r => r.PatientId  == patientId);
        if (providerId is not null) q = q.Where(r => r.ProviderId == providerId);

        return await q.Select(r => ToDto(r)).ToListAsync();
    }

    public async Task<CareRelationshipDto> AssignAsync(string tenantId, AssignCareRelationshipRequest request)
    {
        var existing = await db.CareRelationships.FirstOrDefaultAsync(r =>
            r.TenantId == tenantId &&
            r.PatientId == request.PatientId &&
            r.ProviderId == request.ProviderId);

        if (existing is not null)
        {
            if (existing.IsActive)
                throw new ConflictException("This patient–provider relationship already exists.");

            // Reactivate a previously deactivated relationship.
            existing.IsActive = true;
            await db.SaveChangesAsync();
            logger.LogInformation("Care relationship {Id} reactivated for patient {PatientId}", existing.Id, existing.PatientId);
            return ToDto(existing);
        }

        var rel = new CareRelationship
        {
            TenantId   = tenantId,
            PatientId  = request.PatientId,
            ProviderId = request.ProviderId,
        };
        db.CareRelationships.Add(rel);
        await db.SaveChangesAsync();

        logger.LogInformation("Care relationship {Id} created: patient {PatientId} → provider {ProviderId}",
            rel.Id, rel.PatientId, rel.ProviderId);
        return ToDto(rel);
    }

    public async Task EnsureAsync(string tenantId, string patientId, string providerId)
    {
        var exists = await ExistsAsync(tenantId, patientId, providerId);
        if (exists) return;

        var existing = await db.CareRelationships.FirstOrDefaultAsync(r =>
            r.TenantId == tenantId && r.PatientId == patientId && r.ProviderId == providerId);

        if (existing is not null)
        {
            existing.IsActive = true;
        }
        else
        {
            db.CareRelationships.Add(new CareRelationship
            {
                TenantId   = tenantId,
                PatientId  = patientId,
                ProviderId = providerId,
            });
        }

        await db.SaveChangesAsync();
        logger.LogInformation("Auto-created care relationship for patient {PatientId} with provider {ProviderId}", patientId, providerId);
    }

    public async Task<bool> DeactivateAsync(string tenantId, string id)
    {
        var rel = await db.CareRelationships.FirstOrDefaultAsync(r => r.Id == id && r.TenantId == tenantId);
        if (rel is null) return false;

        rel.IsActive = false;
        await db.SaveChangesAsync();

        logger.LogInformation("Care relationship {Id} deactivated", id);
        return true;
    }

    private static CareRelationshipDto ToDto(CareRelationship r) =>
        new(r.Id, r.TenantId, r.PatientId, r.ProviderId, r.IsActive, r.CreatedAt);
}
