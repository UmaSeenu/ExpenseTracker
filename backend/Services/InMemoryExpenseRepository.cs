using System.Collections.Concurrent;
using backend.Models;

namespace backend.Services;

public sealed class InMemoryExpenseRepository : IExpenseRepository
{
    private readonly ConcurrentBag<Expense> expenses = [];
    private readonly HashSet<Guid> categories =
    [
        Guid.Parse("11111111-1111-1111-1111-111111111111"),
        Guid.Parse("22222222-2222-2222-2222-222222222222"),
        Guid.Parse("33333333-3333-3333-3333-333333333333")
    ];

    public bool CategoryBelongsToUser(Guid categoryId, Guid userId) => categories.Contains(categoryId);

    public Expense Add(Expense expense)
    {
        expenses.Add(expense);
        return expense;
    }
}