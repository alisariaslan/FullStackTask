

namespace Product.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product.Domain.Entities.Product>> GetAllAsync(); 
        Task AddAsync(Product.Domain.Entities.Product product);
    }
}
