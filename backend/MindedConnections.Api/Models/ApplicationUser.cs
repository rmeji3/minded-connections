using Microsoft.AspNetCore.Identity;

namespace MindedConnections.Api.Models;

public class ApplicationUser : IdentityUser
{
    public string?   FirstName { get; set; }
    public string?   LastName  { get; set; }
    public string    Timezone  { get; set; } = "America/Los_Angeles";
    public DateTime  CreatedAt { get; set; } = DateTime.UtcNow;

    public ProviderProfile?        ProviderProfile { get; set; }
    public ICollection<Appointment> Appointments   { get; set; } = [];
}
