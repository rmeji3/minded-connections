using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Data;

public class SchedulingDbContext(DbContextOptions<SchedulingDbContext> options) : DbContext(options)
{
    public DbSet<Tenant>               Tenants              => Set<Tenant>();
    public DbSet<Availability>         Availabilities       => Set<Availability>();
    public DbSet<TimeSlot>             TimeSlots            => Set<TimeSlot>();
    public DbSet<Appointment>          Appointments         => Set<Appointment>();
    public DbSet<ServiceType>          ServiceTypes         => Set<ServiceType>();
    public DbSet<AuditLog>             AuditLogs            => Set<AuditLog>();
    public DbSet<NotificationOutbox>   NotificationOutbox   => Set<NotificationOutbox>();
    public DbSet<CareRelationship>     CareRelationships    => Set<CareRelationship>();
    public DbSet<BlockedSlot>          BlockedSlots         => Set<BlockedSlot>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // -----------------------------------------------------------------------
        // Availability
        // -----------------------------------------------------------------------
        builder.Entity<Availability>()
            .HasIndex(a => new { a.TenantId, a.ProviderId, a.DayOfWeek })
            .IsUnique();

        // -----------------------------------------------------------------------
        // TimeSlot
        // -----------------------------------------------------------------------
        builder.Entity<TimeSlot>()
            .HasOne(s => s.Availability)
            .WithMany(a => a.TimeSlots)
            .HasForeignKey(s => s.AvailabilityId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unique: prevents two concurrent requests from materialising the same virtual slot.
        builder.Entity<TimeSlot>()
            .HasIndex(s => new { s.TenantId, s.ProviderId, s.StartsAt })
            .IsUnique();

        // -----------------------------------------------------------------------
        // Appointment
        // -----------------------------------------------------------------------
        builder.Entity<Appointment>()
            .HasOne(a => a.TimeSlot)
            .WithMany(s => s.Appointments)
            .HasForeignKey(a => a.TimeSlotId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Appointment>()
            .HasIndex(a => new { a.TenantId, a.ProviderId, a.Status });

        builder.Entity<Appointment>()
            .HasIndex(a => new { a.TenantId, a.PatientId });

        builder.Entity<Appointment>()
            .HasIndex(a => a.RecurrenceGroupId)
            .HasFilter("recurrence_group_id IS NOT NULL");

        // Partial unique index: backstop for the TOCTOU race — only one Scheduled appointment per slot.
        builder.Entity<Appointment>()
            .HasIndex(a => a.TimeSlotId)
            .HasFilter("status = 0")
            .IsUnique()
            .HasDatabaseName("ix_appointments_time_slot_scheduled_unique");

        // -----------------------------------------------------------------------
        // Tenant
        // -----------------------------------------------------------------------
        builder.Entity<Tenant>()
            .HasIndex(t => t.Slug)
            .IsUnique();

        builder.Entity<Tenant>()
            .HasIndex(t => t.ApiKeyHash)
            .IsUnique();

        // -----------------------------------------------------------------------
        // ServiceType
        // -----------------------------------------------------------------------
        builder.Entity<ServiceType>()
            .HasIndex(st => new { st.TenantId, st.Name });

        // -----------------------------------------------------------------------
        // AuditLog
        // -----------------------------------------------------------------------
        builder.Entity<AuditLog>()
            .HasIndex(a => new { a.TenantId, a.EntityId });

        builder.Entity<AuditLog>()
            .HasIndex(a => new { a.TenantId, a.ActorId });

        builder.Entity<AuditLog>()
            .HasIndex(a => new { a.TenantId, a.Timestamp });

        // -----------------------------------------------------------------------
        // NotificationOutbox
        // -----------------------------------------------------------------------
        builder.Entity<NotificationOutbox>()
            .HasIndex(n => new { n.ScheduledAt, n.SentAt })
            .HasDatabaseName("ix_notification_outbox_pending");

        builder.Entity<NotificationOutbox>()
            .HasIndex(n => n.AppointmentId);

        // -----------------------------------------------------------------------
        // CareRelationship
        // -----------------------------------------------------------------------
        builder.Entity<CareRelationship>()
            .HasIndex(r => new { r.TenantId, r.PatientId, r.ProviderId })
            .IsUnique();

        builder.Entity<CareRelationship>()
            .HasIndex(r => new { r.TenantId, r.PatientId, r.IsActive });

        builder.Entity<CareRelationship>()
            .HasIndex(r => new { r.TenantId, r.ProviderId, r.IsActive });

        // -----------------------------------------------------------------------
        // BlockedSlot
        // -----------------------------------------------------------------------
        builder.Entity<BlockedSlot>()
            .HasIndex(b => new { b.TenantId, b.ProviderId, b.StartsAt, b.EndsAt });
    }
}
