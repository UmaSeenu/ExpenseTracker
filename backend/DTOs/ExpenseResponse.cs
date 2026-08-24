namespace backend.DTOs;

public sealed record ExpenseResponse(
    Guid ExpenseId,
    decimal Amount,
    Guid CategoryId,
    DateOnly Date,
    string? Description,
    DateTime CreatedAt);