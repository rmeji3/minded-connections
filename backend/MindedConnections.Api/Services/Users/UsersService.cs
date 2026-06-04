using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MindedConnections.Api.Data;
using MindedConnections.Shared.Exceptions;
using MindedConnections.Api.Models;
using MindedConnections.Shared.Constants;
using MindedConnections.Shared.Dtos;
using MindedConnections.Shared.Dtos.Users;
using MindedConnections.Shared.Queries;

namespace MindedConnections.Api.Services.Users;

public sealed class UsersService(
    UserManager<ApplicationUser> userManager,
    AppDbContext                 db,
    ILogger<UsersService>        logger) : IUsersService
{
    // ─────────────────────────────────────────────────────────────────────────
    // Stats
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<UserStats> GetStatsAsync()
    {
        var counts = await (
            from u  in db.Users
            join ur in db.UserRoles on u.Id equals ur.UserId into urs
            from ur in urs.DefaultIfEmpty()
            join r  in db.Roles on ur.RoleId equals r.Id into rs
            from r  in rs.DefaultIfEmpty()
            group r by r.Name into g
            select new { Role = g.Key, Count = g.Count() }
        ).ToListAsync();

        return new UserStats(
            Total:     await db.Users.CountAsync(),
            Patients:  counts.FirstOrDefault(c => c.Role == Roles.Patient)?.Count  ?? 0,
            Providers: counts.FirstOrDefault(c => c.Role == Roles.Provider)?.Count ?? 0,
            Admins:    counts.FirstOrDefault(c => c.Role == Roles.Admin)?.Count    ?? 0);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // List (paginated)
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<PagedResponse<UserDto>> GetUsersAsync(UserListQuery query)
    {
        var q =
            from u  in db.Users
            join ur in db.UserRoles on u.Id equals ur.UserId into urs
            from ur in urs.DefaultIfEmpty()
            join r  in db.Roles on ur.RoleId equals r.Id into rs
            from r  in rs.DefaultIfEmpty()
            select new { User = u, Role = r.Name };

        if (!string.IsNullOrWhiteSpace(query.Role))
            q = q.Where(x => x.Role == query.Role);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.ToLower();
            q = q.Where(x =>
                (x.User.Email     != null && x.User.Email.ToLower().Contains(term))     ||
                (x.User.FirstName != null && x.User.FirstName.ToLower().Contains(term)) ||
                (x.User.LastName  != null && x.User.LastName.ToLower().Contains(term)));
        }

        var total = await q.CountAsync();

        var items = await q
            .OrderBy(x => x.User.CreatedAt)
            .Skip(query.Skip)
            .Take(query.SafePageSize)
            .Select(x => ToDto(x.User, x.Role))
            .ToListAsync();

        return new PagedResponse<UserDto>(items, total, query.SafePage, query.SafePageSize);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Single
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<UserDto> GetUserAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id)
            ?? throw new KeyNotFoundException($"User '{id}' not found.");

        var roles = await userManager.GetRolesAsync(user);
        return ToDto(user, roles.FirstOrDefault());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Create Provider
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<UserDto> CreateProviderAsync(CreateProviderRequest req)
    {
        var user = new ApplicationUser
        {
            UserName       = req.Email,
            Email          = req.Email,
            EmailConfirmed = true,
            FirstName      = req.FirstName,
            LastName       = req.LastName,
            PhoneNumber    = req.Phone,
            Timezone       = req.Timezone ?? "America/Los_Angeles",
        };

        var result = await userManager.CreateAsync(user, req.Password);
        if (!result.Succeeded)
        {
            logger.LogWarning("Failed to create provider {Email}: {Errors}",
                req.Email, string.Join("; ", result.Errors.Select(e => e.Description)));
            throw new ValidationException(result.Errors.Select(e => e.Description));
        }

        await userManager.AddToRoleAsync(user, Roles.Provider);
        logger.LogInformation("Provider account created: {UserId} ({Email})", user.Id, user.Email);

        db.ProviderProfiles.Add(new ProviderProfile
        {
            UserId    = user.Id,
            Title     = req.Title,
            Specialty = req.Specialty,
            Bio       = req.Bio,
        });

        await db.SaveChangesAsync();

        return ToDto(user, Roles.Provider);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Create Patient
    // ─────────────────────────────────────────────────────────────────────────

    public async Task<UserDto> CreatePatientAsync(CreatePatientRequest req)
    {
        var user = new ApplicationUser
        {
            UserName       = req.Email,
            Email          = req.Email,
            EmailConfirmed = true,
            FirstName      = req.FirstName,
            LastName       = req.LastName,
            PhoneNumber    = req.Phone,
            Timezone       = req.Timezone ?? "America/Los_Angeles",
        };

        var result = await userManager.CreateAsync(user, req.Password);
        if (!result.Succeeded)
        {
            logger.LogWarning("Failed to create patient {Email}: {Errors}",
                req.Email, string.Join("; ", result.Errors.Select(e => e.Description)));
            throw new ValidationException(result.Errors.Select(e => e.Description));
        }

        await userManager.AddToRoleAsync(user, Roles.Patient);
        logger.LogInformation("Patient account created: {UserId} ({Email})", user.Id, user.Email);

        return ToDto(user, Roles.Patient);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Delete
    // ─────────────────────────────────────────────────────────────────────────

    public async Task DeleteUserAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id)
            ?? throw new KeyNotFoundException($"User '{id}' not found.");

        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            logger.LogWarning("Failed to delete user {UserId}: {Errors}",
                id, string.Join("; ", result.Errors.Select(e => e.Description)));
            throw new ValidationException(result.Errors.Select(e => e.Description));
        }

        logger.LogInformation("User deleted: {UserId} ({Email})", id, user.Email);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private static UserDto ToDto(ApplicationUser u, string? role) =>
        new(u.Id, u.Email!, u.FirstName, u.LastName, u.PhoneNumber, role, u.CreatedAt.ToString("o"));
}
