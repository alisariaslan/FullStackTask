using Services.Product.Domain.Entities;
using Shared.Kernel.Models;

namespace Services.Product.Application.Interfaces
{
    public interface IProductRepository
    {

        Task<ProductEntity?> GetBySlugAsync(string slug, string languageCode);
        Task AddAsync(ProductEntity product);
        Task<ProductEntity?> GetByIdAsync(Guid id);
        Task<bool> SlugExistsAsync(string slug, string languageCode);
        Task UpdateAsync(ProductEntity product);

        Task<PaginatedResult<ProductEntity>> GetFilteredProductsAsync(
        string languageCode, string? searchTerm, Guid? categoryId,
        decimal? minPrice, decimal? maxPrice, string? sortBy,
        int pageNumber, int pageSize);
    }
}
