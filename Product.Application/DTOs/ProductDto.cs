namespace Product.Application.DTOs
{
    public record ProductDto(int Id, string Name, decimal Price, int Stock);

    public record CreateProductDto(string Name, decimal Price, int Stock);
}
