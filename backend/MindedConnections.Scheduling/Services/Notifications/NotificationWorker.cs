using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MindedConnections.Scheduling.Data;
using MindedConnections.Scheduling.Dtos.Notifications;

namespace MindedConnections.Scheduling.Services.Notifications;

/// <summary>
/// Background service that dispatches due notification outbox entries every minute.
/// Uses its own DI scope per tick to avoid holding a long-lived DbContext.
/// </summary>
public class NotificationWorker(IServiceScopeFactory scopeFactory, ILogger<NotificationWorker> logger)
    : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromMinutes(1);
    private const int MaxRetries = 3;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("NotificationWorker started");

        while (!stoppingToken.IsCancellationRequested)
        {
            await ProcessDueNotificationsAsync(stoppingToken);
            await Task.Delay(Interval, stoppingToken);
        }
    }

    private async Task ProcessDueNotificationsAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var db     = scope.ServiceProvider.GetRequiredService<SchedulingDbContext>();
        var sender = scope.ServiceProvider.GetRequiredService<IEmailSender>();

        var due = await db.NotificationOutbox
            .Where(n => n.SentAt == null && n.ScheduledAt <= DateTime.UtcNow && n.Retries < MaxRetries)
            .Take(50)
            .ToListAsync(ct);

        foreach (var entry in due)
        {
            try
            {
                var payload = JsonSerializer.Deserialize<NotificationPayload>(entry.PayloadJson);
                if (payload is null) throw new InvalidOperationException("Null payload after deserialization.");

                await sender.SendAsync(entry.Type, payload, ct);
                entry.SentAt = DateTime.UtcNow;
            }
            catch (Exception ex)
            {
                entry.Retries++;
                entry.LastError = ex.Message[..Math.Min(ex.Message.Length, 1000)];
                logger.LogWarning(ex,
                    "Notification dispatch failed for {Id} (attempt {Retries}/{MaxRetries})",
                    entry.Id, entry.Retries, MaxRetries);
            }
        }

        if (due.Count > 0)
            await db.SaveChangesAsync(ct);
    }
}
