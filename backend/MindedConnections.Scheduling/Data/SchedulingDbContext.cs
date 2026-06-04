using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Models;

namespace MindedConnections.Scheduling.Data;

public class SchedulingDbContext(DbContextOptions<SchedulingDbContext> options) : DbContext(options)
{
    public DbSet<Availability> Availabilities => Set<Availability>();
    public DbSet<TimeSlot>     TimeSlots       => Set<TimeSlot>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<TimeSlot>()
            .HasOne(s => s.Availability)
            .WithMany(a => a.TimeSlots)
            .HasForeignKey(s => s.AvailabilityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Availability>()
            .HasIndex(a => new { a.ProviderId, a.DayOfWeek })
            .IsUnique();
    }
}
