namespace MindedConnections.Shared.Exceptions;

/// <summary>
/// Thrown by services when input fails domain or Identity validation.
/// Controllers map this to a 400 response.
/// </summary>
public sealed class ValidationException(IEnumerable<string> errors)
    : Exception("One or more validation errors occurred.")
{
    public IReadOnlyList<string> Errors { get; } = errors.ToList();
}
