

using Product.Domain.Entities;

namespace Product.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<List<ProductEntity>> GetAllAsync(); 
        Task AddAsync(ProductEntity product);
    }
}
