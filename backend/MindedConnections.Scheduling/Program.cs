using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Services.Appointments;
using MindedConnections.Scheduling.Services.Availability;
using MindedConnections.Scheduling.Services.Slots;
using MindedConnections.Scheduling.Services.Tenants;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Map SNAKE_CASE env vars to config keys
// ---------------------------------------------------------------------------
builder.Configuration.AddInMemoryCollection(
    new Dictionary<string, string?>
    {
        ["ConnectionStrings:Scheduling"] = Environment.GetEnvironmentVariable("SCHEDULING_DATABASE_URL"),
        ["Cors:Origin"]                  = Environment.GetEnvironmentVariable("CORS_ORIGIN"),
    }.Where(kv => kv.Value is not null)!
);

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
builder.Services.AddDbContext<SchedulingDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Scheduling")));

// ---------------------------------------------------------------------------
// JWT Bearer — validates Supabase-issued tokens via JWKS
// ---------------------------------------------------------------------------
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.Authority = "https://xkmvkglvktoczljmetxv.supabase.co/auth/v1";
        opt.TokenValidationParameters = new()
        {
            ValidAudience    = "authenticated",
            ValidateLifetime = true,
            ClockSkew        = TimeSpan.Zero,
        };
    });

// Extracts app_metadata.role from the Supabase JWT and maps it to ClaimTypes.Role.
builder.Services.AddTransient<IClaimsTransformation, MindedConnections.Scheduling.Middleware.SupabaseClaimsTransformation>();

builder.Services.AddAuthorization();

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
var corsOrigin = builder.Configuration["Cors:Origin"] ?? "http://localhost:3000";
builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(policy =>
        policy.WithOrigins(corsOrigin)
              .AllowAnyMethod()
              .WithHeaders("Content-Type", "Authorization", "X-Api-Key")
              .AllowCredentials()));

// ---------------------------------------------------------------------------
// Tenant context — scoped so it's populated per-request by TenantMiddleware
// ---------------------------------------------------------------------------
builder.Services.AddScoped<TenantContext>();
builder.Services.AddScoped<ITenantContext>(sp => sp.GetRequiredService<TenantContext>());

// ---------------------------------------------------------------------------
// Domain services
// ---------------------------------------------------------------------------
builder.Services.AddScoped<ITenantService,      TenantService>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<ISlotService,         SlotService>();
builder.Services.AddScoped<IAppointmentService,  AppointmentService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ---------------------------------------------------------------------------
// Migrate DB on startup (safe for dev; use a deploy step in production)
// ---------------------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SchedulingDbContext>();
    await db.Database.MigrateAsync();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(opt =>
    {
        opt.Title = "MindEd Connections — Scheduling API";
        opt.Theme = ScalarTheme.Moon;
        opt.DefaultHttpClient = new(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Tenant resolution runs after auth so we have the user identity in scope.
app.UseMiddleware<TenantMiddleware>();

// Populate the scoped TenantContext from HttpContext.Items set by TenantMiddleware.
app.Use(async (context, next) =>
{
    if (context.Items.TryGetValue("TenantId", out var tenantId) && tenantId is string id)
    {
        var tenantCtx = context.RequestServices.GetRequiredService<TenantContext>();
        tenantCtx.TenantId = id;
    }
    await next();
});

app.MapControllers();

app.MapGet("/health", (IWebHostEnvironment env) =>
    Results.Ok(new { status = "ok", service = "scheduling", environment = env.EnvironmentName }));

app.Run();
