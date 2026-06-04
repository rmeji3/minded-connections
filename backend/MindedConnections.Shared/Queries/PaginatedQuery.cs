namespace MindedConnections.Shared.Queries;

/// <summary>
/// Base query parameters for any paginated endpoint.
/// Bind with [FromQuery] in controllers.
/// </summary>
public record PaginatedQuery
{
    public int Page     { get; init; } = 1;
    public int PageSize { get; init; } = 20;

    public int SafePage     => Math.Max(Page, 1);
    public int SafePageSize => Math.Clamp(PageSize, 1, MaxPageSize);

    protected virtual int MaxPageSize => 100;

    public int Skip => (SafePage - 1) * SafePageSize;
}
