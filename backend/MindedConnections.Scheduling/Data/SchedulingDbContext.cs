using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Data;

public class SchedulingDbContext(DbContextOptions<SchedulingDbContext> options) : DbContext(options)
{
    public DbSet<Tenant>       Tenants       => Set<Tenant>();
    public DbSet<Availability> Availabilities => Set<Availability>();
    public DbSet<TimeSlot>     TimeSlots      => Set<TimeSlot>();
    public DbSet<Appointment>  Appointments   => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Availability>()
            .HasIndex(a => new { a.TenantId, a.ProviderId, a.DayOfWeek })
            .IsUnique();

        builder.Entity<TimeSlot>()
            .HasOne(s => s.Availability)
            .WithMany(a => a.TimeSlots)
            .HasForeignKey(s => s.AvailabilityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<TimeSlot>()
            .HasIndex(s => new { s.TenantId, s.ProviderId, s.StartsAt });

        builder.Entity<Appointment>()
            .HasOne(a => a.TimeSlot)
            .WithOne(s => s.Appointment)
            .HasForeignKey<Appointment>(a => a.TimeSlotId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Appointment>()
            .HasIndex(a => new { a.TenantId, a.ProviderId, a.Status });

        builder.Entity<Appointment>()
            .HasIndex(a => new { a.TenantId, a.PatientId });

        builder.Entity<Tenant>()
            .HasIndex(t => t.Slug)
            .IsUnique();

        builder.Entity<Tenant>()
            .HasIndex(t => t.ApiKeyHash)
            .IsUnique();
    }
}
