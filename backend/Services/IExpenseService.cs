using backend.DTOs;

namespace backend.Services;

public interface IExpenseService
{
    Result<ExpenseResponse> Create(Guid userId, CreateExpenseRequest request);
}

public sealed record Result<T>(T? Value, string? Error, bool IsSuccess)
{
    public static Result<T> Success(T value) => new(value, null, true);
    public static Result<T> Failure(string error) => new(default, error, false);
}