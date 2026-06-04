using System.Text;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MindedConnections.Scheduling.Data;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------------
// Map SNAKE_CASE env vars to config keys
// ---------------------------------------------------------------------------
builder.Configuration.AddInMemoryCollection(
    new Dictionary<string, string?>
    {
        ["ConnectionStrings:Scheduling"] = Environment.GetEnvironmentVariable("SCHEDULING_DATABASE_URL"),
        ["Jwt:Secret"]                   = Environment.GetEnvironmentVariable("JWT_SECRET"),
        ["Cors:Origin"]                  = Environment.GetEnvironmentVariable("CORS_ORIGIN"),
    }.Where(kv => kv.Value is not null)!
);

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
builder.Services.AddDbContext<SchedulingDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Scheduling")));

// ---------------------------------------------------------------------------
// JWT Bearer — validates tokens issued by the main API (shared secret)
// ---------------------------------------------------------------------------
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey         = new SymmetricSecurityKey(
                                           Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ValidateIssuer           = true,
            ValidIssuer              = "minded-connections-api",
            ValidateAudience         = true,
            ValidAudience            = "minded-connections-clients",
            ValidateLifetime         = true,
            ClockSkew                = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
var corsOrigin = builder.Configuration["Cors:Origin"] ?? "http://localhost:3000";
builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(policy =>
        policy.WithOrigins(corsOrigin)
              .AllowAnyMethod()
              .WithHeaders("Content-Type", "Authorization")
              .AllowCredentials()));

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

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
app.MapControllers();

app.MapGet("/health", (IWebHostEnvironment env) =>
    Results.Ok(new { status = "ok", service = "scheduling", environment = env.EnvironmentName }));

app.Run();
