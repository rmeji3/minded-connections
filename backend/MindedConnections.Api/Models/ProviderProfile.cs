using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Api.Models;

[Table("provider_profiles")]
public class ProviderProfile
{
    [Key]
    [Column("user_id")]
    public string UserId { get; set; } = default!;

    [Column("title")]
    public string Title { get; set; } = default!;

    [Column("specialty")]
    public string? Specialty { get; set; }

    [Column("bio")]
    public string? Bio { get; set; }

    [Column("avatar_url")]
    public string? AvatarUrl { get; set; }

    public ApplicationUser User { get; set; } = default!;

    public ICollection<AppointmentType> AppointmentTypes { get; set; } = [];
    public ICollection<Appointment>     Appointments     { get; set; } = [];
}
