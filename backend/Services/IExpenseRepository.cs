using backend.Models;

namespace backend.Services;

public interface IExpenseRepository
{
    bool CategoryBelongsToUser(Guid categoryId, Guid userId);
    Expense Add(Expense expense);
}