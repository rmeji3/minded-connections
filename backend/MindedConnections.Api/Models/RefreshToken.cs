using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MindedConnections.Api.Models;

[Table("refresh_tokens")]
public class RefreshToken
{
    [Key]
    public int Id { get; set; }

    [Column("token")]
    public string Token { get; set; } = default!;

    [Column("user_id")]
    public string UserId { get; set; } = default!;

    public ApplicationUser User { get; set; } = default!;

    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("revoked_at")]
    public DateTime? RevokedAt { get; set; }

    [NotMapped] public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    [NotMapped] public bool IsRevoked  => RevokedAt is not null;
    [NotMapped] public bool IsActive   => !IsRevoked && !IsExpired;
}
