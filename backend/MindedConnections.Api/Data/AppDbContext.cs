using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MindedConnections.Api.Models;

namespace MindedConnections.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<ProviderProfile> ProviderProfiles => Set<ProviderProfile>();
    public DbSet<AppointmentType> AppointmentTypes => Set<AppointmentType>();
    public DbSet<Appointment>     Appointments     => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ProviderProfile>()
            .HasOne(p => p.User)
            .WithOne(u => u.ProviderProfile)
            .HasForeignKey<ProviderProfile>(p => p.UserId);

        builder.Entity<Appointment>()
            .HasOne(a => a.Patient)
            .WithMany(u => u.Appointments)
            .HasForeignKey(a => a.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Appointment>()
            .HasOne(a => a.Provider)
            .WithMany(p => p.Appointments)
            .HasForeignKey(a => a.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Appointment>()
            .HasOne(a => a.Type)
            .WithMany(t => t.Appointments)
            .HasForeignKey(a => a.TypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<AppointmentType>()
            .HasOne(t => t.Provider)
            .WithMany(p => p.AppointmentTypes)
            .HasForeignKey(t => t.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
