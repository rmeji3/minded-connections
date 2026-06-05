namespace MindedConnections.Shared.Exceptions;

public sealed class ForbiddenException(string message) : Exception(message);
