using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Middleware;
using MindedConnections.Scheduling.Services.Appointments;
using MindedConnections.Scheduling.Services.Audit;
using MindedConnections.Scheduling.Services.Availability;
using MindedConnections.Scheduling.Services.BlockedSlots;
using MindedConnections.Scheduling.Services.CareRelationships;
using MindedConnections.Scheduling.Services.Notifications;
using MindedConnections.Scheduling.Services.Slots;
using MindedConnections.Scheduling.Services.Tenants;
using MindedConnections.Scheduling.Services.ServiceTypes;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Map SNAKE_CASE env vars to config keys
// ---------------------------------------------------------------------------
builder.Configuration.AddInMemoryCollection(
    new Dictionary<string, string?>
    {
        ["ConnectionStrings:Scheduling"]          = Environment.GetEnvironmentVariable("SCHEDULING_DATABASE_URL"),
        ["Cors:Origin"]                           = Environment.GetEnvironmentVariable("CORS_ORIGIN"),
        ["Jitsi:BaseUrl"]                         = Environment.GetEnvironmentVariable("JITSI_BASE_URL"),
        ["Supabase:Authority"]                    = Environment.GetEnvironmentVariable("SUPABASE_AUTHORITY"),
        ["Scheduling:CancellationDeadlineHours"]  = Environment.GetEnvironmentVariable("CANCELLATION_DEADLINE_HOURS"),
        ["Scheduling:RescheduleDeadlineHours"]    = Environment.GetEnvironmentVariable("RESCHEDULE_DEADLINE_HOURS"),
        ["Scheduling:MaxRescheduleCount"]         = Environment.GetEnvironmentVariable("MAX_RESCHEDULE_COUNT"),
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
        opt.Authority = builder.Configuration["Supabase:Authority"];
        opt.TokenValidationParameters = new()
        {
            ValidAudience    = "authenticated",
            ValidateLifetime = true,
            ClockSkew        = TimeSpan.Zero,
        };
    });

// Extracts app_metadata.role from the Supabase JWT and maps it to ClaimTypes.Role.
builder.Services.AddTransient<IClaimsTransformation, SupabaseClaimsTransformation>();

builder.Services.AddAuthorization();

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("booking", opt =>
    {
        opt.Window               = TimeSpan.FromMinutes(1);
        opt.PermitLimit          = 10;
        opt.QueueLimit           = 0;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });

    options.AddFixedWindowLimiter("api-global", opt =>
    {
        opt.Window               = TimeSpan.FromMinutes(1);
        opt.PermitLimit          = 120;
        opt.QueueLimit           = 5;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });

    options.OnRejected = async (context, ct) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
            context.HttpContext.Response.Headers.RetryAfter =
                ((int)retryAfter.TotalSeconds).ToString();

        var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogWarning("Rate limit exceeded for {IP} on {Path}",
            context.HttpContext.Connection.RemoteIpAddress,
            context.HttpContext.Request.Path);

        await context.HttpContext.Response.WriteAsync("Too many requests. Please try again later.", ct);
    };
});

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
builder.Services.AddScoped<ITenantService,            TenantService>();
builder.Services.AddScoped<IAvailabilityService,      AvailabilityService>();
builder.Services.AddScoped<ISlotService,              SlotService>();
builder.Services.AddScoped<IAppointmentService,       AppointmentService>();
builder.Services.AddScoped<IServiceTypeService,       ServiceTypeService>();
builder.Services.AddScoped<IAuditService,             AuditService>();
builder.Services.AddScoped<INotificationService,      NotificationService>();
builder.Services.AddScoped<ICareRelationshipService,  CareRelationshipService>();
builder.Services.AddScoped<IBlockedSlotService,       BlockedSlotService>();

// ---------------------------------------------------------------------------
// Email sender — swap ConsoleEmailSender for a real provider when ready.
// See appsettings.json "Email" section for required configuration keys.
// ---------------------------------------------------------------------------
builder.Services.AddScoped<IEmailSender, ConsoleEmailSender>();

// ---------------------------------------------------------------------------
// Background notification worker
// ---------------------------------------------------------------------------
builder.Services.AddHostedService<NotificationWorker>();

// ---------------------------------------------------------------------------
// Global exception handler
// ---------------------------------------------------------------------------
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Components ??= new Microsoft.OpenApi.OpenApiComponents();
        document.Components.SecuritySchemes ??= new Dictionary<string, Microsoft.OpenApi.IOpenApiSecurityScheme>();

        document.Components.SecuritySchemes.Add("Bearer", new Microsoft.OpenApi.OpenApiSecurityScheme
        {
            Type         = Microsoft.OpenApi.SecuritySchemeType.Http,
            Scheme       = "bearer",
            BearerFormat = "JWT",
            In           = Microsoft.OpenApi.ParameterLocation.Header,
            Description  = "Enter your Supabase JWT access token",
        });
        document.Components.SecuritySchemes.Add("ApiKey", new Microsoft.OpenApi.OpenApiSecurityScheme
        {
            Type        = Microsoft.OpenApi.SecuritySchemeType.ApiKey,
            Name        = "X-Api-Key",
            In          = Microsoft.OpenApi.ParameterLocation.Header,
            Description = "Enter your Tenant API key (starts with sk_)",
        });

        document.Security = new List<Microsoft.OpenApi.OpenApiSecurityRequirement>
        {
            new()
            {
                [new Microsoft.OpenApi.OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>(),
                [new Microsoft.OpenApi.OpenApiSecuritySchemeReference("ApiKey",  document)] = new List<string>(),
            }
        };

        return Task.CompletedTask;
    });
});

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
        opt.Title             = "MindEd Connections — Scheduling API";
        opt.Theme             = ScalarTheme.Moon;
        opt.DefaultHttpClient = new(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<TenantMiddleware>();

app.Use(async (context, next) =>
{
    if (context.Items.TryGetValue("TenantId", out var tenantId) && tenantId is string id)
    {
        var tenantCtx = context.RequestServices.GetRequiredService<TenantContext>();
        tenantCtx.TenantId = id;
    }
    await next();
});

app.MapControllers().RequireRateLimiting("api-global");

app.MapGet("/health", (IWebHostEnvironment env) =>
    Results.Ok(new { status = "ok", service = "scheduling", environment = env.EnvironmentName }));

app.Run();
