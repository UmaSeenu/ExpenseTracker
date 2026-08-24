namespace backend.Models;

public sealed class Expense
{
    public Guid ExpenseId { get; init; }
    public Guid UserId { get; init; }
    public decimal Amount { get; init; }
    public Guid CategoryId { get; init; }
    public DateOnly Date { get; init; }
    public string? Description { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}