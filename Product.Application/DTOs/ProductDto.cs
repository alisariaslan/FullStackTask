namespace Product.Application.DTOs
{
    public record ProductDto(Guid Id, string Name, decimal Price, int Stock);

    public record CreateProductDto(string Name, decimal Price, int Stock);
}
