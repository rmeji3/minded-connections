using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Api.Models;

[Table("appointment_types")]
public class AppointmentType
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("label")]
    public string Label { get; set; } = default!;

    [Column("duration_min")]
    public int DurationMin { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("provider_id")]
    public string ProviderId { get; set; } = default!;

    public ProviderProfile          Provider     { get; set; } = default!;
    public ICollection<Appointment> Appointments { get; set; } = [];
}
