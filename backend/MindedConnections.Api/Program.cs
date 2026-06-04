using System.Text;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Events;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MindedConnections.Api.Data;
using MindedConnections.Api.Models;
using MindedConnections.Api.Services.Auth;
using MindedConnections.Api.Services.Jwt;
using MindedConnections.Api.Services.Users;
using MindedConnections.Shared.Constants;

// ---------------------------------------------------------------------------
// Bootstrap logger — captures startup errors before full config is loaded
// ---------------------------------------------------------------------------
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting MindEd Connections API");

    var builder = WebApplication.CreateBuilder(args);

    // ── Serilog — read full config from appsettings ──────────────────────────
    builder.Host.UseSerilog((ctx, services, config) =>
        config.ReadFrom.Configuration(ctx.Configuration)
              .ReadFrom.Services(services)
              .Enrich.FromLogContext());

    // ── SNAKE_CASE env var mapping ───────────────────────────────────────────
    builder.Configuration.AddInMemoryCollection(
        new Dictionary<string, string?>
        {
            ["ConnectionStrings:Default"] = Environment.GetEnvironmentVariable("DATABASE_URL"),
            ["Jwt:Secret"]                = Environment.GetEnvironmentVariable("JWT_SECRET"),
            ["Cors:Origin"]               = Environment.GetEnvironmentVariable("CORS_ORIGIN"),
            ["Cookie:Secure"]             = Environment.GetEnvironmentVariable("COOKIE_SECURE"),
        }.Where(kv => kv.Value is not null)!
    );

    // ── Database ─────────────────────────────────────────────────────────────
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

    // ── ASP.NET Core Identity ─────────────────────────────────────────────────
    builder.Services.AddIdentity<ApplicationUser, IdentityRole>(opt =>
    {
        opt.Password.RequiredLength         = 10;
        opt.Password.RequireDigit           = true;
        opt.Password.RequireLowercase       = true;
        opt.Password.RequireUppercase       = true;
        opt.Password.RequireNonAlphanumeric = true;

        opt.Lockout.MaxFailedAccessAttempts = 5;
        opt.Lockout.DefaultLockoutTimeSpan  = TimeSpan.FromMinutes(15);
        opt.Lockout.AllowedForNewUsers      = true;

        opt.SignIn.RequireConfirmedEmail = true;
        opt.User.RequireUniqueEmail      = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

    // ── JWT Bearer ────────────────────────────────────────────────────────────
    builder.Services.AddAuthentication(opt =>
    {
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey         = new SymmetricSecurityKey(
                                           Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ValidateIssuer           = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidateAudience         = true,
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            ValidateLifetime         = true,
            ClockSkew                = TimeSpan.Zero,
        };

        opt.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                Log.Warning("JWT authentication failed: {Error}", ctx.Exception.Message);
                return Task.CompletedTask;
            },
        };
    });

    builder.Services.AddAuthorization();

    // ── Application services ──────────────────────────────────────────────────
    builder.Services.AddScoped<IJwtService,   JwtService>();
    builder.Services.AddScoped<IAuthService,  AuthService>();
    builder.Services.AddScoped<IUsersService, UsersService>();

    // ── CORS ──────────────────────────────────────────────────────────────────
    var corsOrigin = builder.Configuration["Cors:Origin"] ?? "http://localhost:3000";
    builder.Services.AddCors(opt =>
        opt.AddDefaultPolicy(policy =>
            policy.WithOrigins(corsOrigin)
                  .AllowAnyMethod()
                  .WithHeaders("Content-Type", "Authorization")
                  .AllowCredentials()));

    // ── HttpContext accessor (needed by CorrelationId enricher) ───────────────
    builder.Services.AddHttpContextAccessor();

    builder.Services.AddControllers();
    builder.Services.AddOpenApi();

    // ── Build ─────────────────────────────────────────────────────────────────
    var app = builder.Build();

    // ── Seed roles + default admin ────────────────────────────────────────────
    using (var scope = app.Services.CreateScope())
    {
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        foreach (var role in new[] { Roles.Admin, Roles.Provider, Roles.Patient })
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
                Log.Information("Created role {Role}", role);
            }
        }

        var adminEmail    = app.Configuration["Seed:AdminEmail"];
        var adminPassword = app.Configuration["Seed:AdminPassword"];

        if (!string.IsNullOrEmpty(adminEmail) && !string.IsNullOrEmpty(adminPassword))
        {
            if (await userManager.FindByEmailAsync(adminEmail) is null)
            {
                var admin = new ApplicationUser
                {
                    UserName       = adminEmail,
                    Email          = adminEmail,
                    EmailConfirmed = true,
                    FirstName      = "System",
                    LastName       = "Admin",
                };
                var result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, Roles.Admin);
                    Log.Information("Seeded admin account {Email}", adminEmail);
                }
                else
                {
                    Log.Warning("Failed to seed admin {Email}: {Errors}",
                        adminEmail, string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }

    // ── Middleware pipeline ───────────────────────────────────────────────────
    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference(opt =>
        {
            opt.Title = "MindEd Connections API";
            opt.Theme = ScalarTheme.Moon;
            opt.DefaultHttpClient = new(ScalarTarget.CSharp, ScalarClient.HttpClient);
        });
    }

    // Serilog HTTP request logging — replaces the default ASP.NET access log
    app.UseSerilogRequestLogging(opt =>
    {
        opt.MessageTemplate =
            "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0}ms";

        // Attach extra properties to each request log event
        opt.EnrichDiagnosticContext = (diag, ctx) =>
        {
            diag.Set("RequestHost",   ctx.Request.Host.Value);
            diag.Set("RequestScheme", ctx.Request.Scheme);
            diag.Set("UserAgent",     ctx.Request.Headers.UserAgent.ToString());

            if (ctx.User.Identity?.IsAuthenticated == true)
                diag.Set("UserId", ctx.User.FindFirst("sub")?.Value ?? "unknown");
        };

        // Only log at Warning+ for health-check noise
        opt.GetLevel = (ctx, _, ex) =>
            ex is not null                   ? LogEventLevel.Error   :
            ctx.Response.StatusCode >= 500   ? LogEventLevel.Error   :
            ctx.Response.StatusCode >= 400   ? LogEventLevel.Warning :
            ctx.Request.Path == "/health"    ? LogEventLevel.Debug   :
            LogEventLevel.Information;
    });

    app.UseHttpsRedirection();
    app.UseCors();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.MapGet("/health", (IWebHostEnvironment env) =>
        Results.Ok(new { status = "ok", service = "api", environment = env.EnvironmentName }));

    await app.RunAsync();
}
catch (Exception ex) when (ex is not OperationCanceledException)
{
    Log.Fatal(ex, "API terminated unexpectedly");
}
finally
{
    await Log.CloseAndFlushAsync();
}
