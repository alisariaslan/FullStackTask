using Services.Product.Domain.Entities;

namespace Services.Product.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<List<ProductEntity>> GetAllAsync();
        Task AddAsync(ProductEntity product);
        Task<ProductEntity?> GetByIdAsync(Guid id);
        Task<bool> SlugExistsAsync(string slug);
        Task UpdateAsync(ProductEntity product);
    }
}
