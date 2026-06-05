# Services/Notifications

Outbox-pattern notification infrastructure. Queues notification payloads to the database, then dispatches them asynchronously via a background worker.

## What belongs here

- Outbox queueing (`NotificationService`)
- Background dispatch worker (`NotificationWorker`)
- Email sender abstraction (`IEmailSender`) and its stub/real implementations

## Files

| File | Purpose |
|---|---|
| `INotificationService.cs` | Interface — methods for each notification trigger (booking, cancel, reschedule) |
| `NotificationService.cs` | Queues rows to `notification_outbox`; failures are caught and logged |
| `IEmailSender.cs` | Interface — `SendAsync(type, payload)`. Swap implementations here to change provider |
| `ConsoleEmailSender.cs` | **Stub** — logs to console. Replace with a real provider when ready |
| `NotificationWorker.cs` | `BackgroundService` — polls every 60s, dispatches due outbox entries, retries up to 3× |

## Connecting a real email provider

1. Implement `IEmailSender` (e.g. `ResendEmailSender`, `SendGridEmailSender`).
2. Add provider config keys under `"Email"` in `appsettings.json` / env vars.
3. In `Program.cs` replace: `builder.Services.AddScoped<IEmailSender, ConsoleEmailSender>()` with your implementation.

The `NotificationWorker` and `NotificationService` require no changes.

## Payload

`NotificationPayload` is captured at queue time and stored as JSON in `notification_outbox.payload_json`. This means the worker needs no DB joins to build the email.

## Retry policy

Max 3 retries. After the third failure the row stays undelivered with `last_error` populated. There is no dead-letter queue yet — add one if you need alerting on persistent failures.
