namespace Services.Product.Application.Models
{
    public record ProductDto(
        Guid Id,
        string Name,
        decimal Price,
        int Stock,
        string? ImageUrl,
        Guid CategoryId,
        string CategoryName
    );
}
