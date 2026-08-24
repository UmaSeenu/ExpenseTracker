using backend.DTOs;
using backend.Models;

namespace backend.Services;

public sealed class ExpenseService(IExpenseRepository repository) : IExpenseService
{
    public Result<ExpenseResponse> Create(Guid userId, CreateExpenseRequest request)
    {
        if (userId == Guid.Empty)
            return Result<ExpenseResponse>.Failure("A valid user is required.");

        if (request.CategoryId == Guid.Empty || !repository.CategoryBelongsToUser(request.CategoryId, userId))
            return Result<ExpenseResponse>.Failure("The selected category does not exist.");

        if (request.Date is null)
            return Result<ExpenseResponse>.Failure("Date is required.");

        var now = DateTime.UtcNow;
        var expense = new Expense
        {
            ExpenseId = Guid.NewGuid(),
            UserId = userId,
            Amount = request.Amount,
            CategoryId = request.CategoryId,
            Date = request.Date.Value,
            Description = request.Description?.Trim(),
            CreatedAt = now,
            UpdatedAt = now
        };

        repository.Add(expense);
        return Result<ExpenseResponse>.Success(new ExpenseResponse(
            expense.ExpenseId,
            expense.Amount,
            expense.CategoryId,
            expense.Date,
            expense.Description,
            expense.CreatedAt));
    }
}