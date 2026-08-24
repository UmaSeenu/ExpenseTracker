using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/v1/expenses")]
public sealed class ExpensesController(IExpenseService expenseService) : ControllerBase
{
    private static readonly Guid DemoUserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");

    [HttpPost]
    [ProducesResponseType(typeof(ExpenseResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<ExpenseResponse> Create(CreateExpenseRequest request)
    {
        var result = expenseService.Create(DemoUserId, request);
        if (!result.IsSuccess)
            return Problem(statusCode: StatusCodes.Status400BadRequest, title: "Expense validation failed", detail: result.Error);

        return CreatedAtAction(nameof(Create), new { expenseId = result.Value!.ExpenseId }, result.Value);
    }
}