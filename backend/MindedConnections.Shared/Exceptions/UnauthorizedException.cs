namespace MindedConnections.Shared.Exceptions;

/// <summary>
/// Thrown by services when authentication or credential validation fails.
/// Controllers map this to a 401 response.
/// </summary>
public sealed class UnauthorizedException(string message) : Exception(message);
