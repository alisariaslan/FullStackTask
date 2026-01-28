namespace Product.Application.DTOs
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
