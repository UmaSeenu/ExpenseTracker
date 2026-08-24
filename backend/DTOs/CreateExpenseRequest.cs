using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public sealed class CreateExpenseRequest
{
    [Range(typeof(decimal), "0.01", "9999999999.99")]
    public decimal Amount { get; init; }

    [Required]
    public Guid CategoryId { get; init; }

    [Required]
    public DateOnly? Date { get; init; }

    [StringLength(500)]
    public string? Description { get; init; }
}