using Services.Product.Domain.Entities;

namespace Services.Product.Application.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<CategoryEntity>> GetAllAsync();
        Task AddAsync(CategoryEntity category);
        Task<CategoryEntity?> GetByIdAsync(Guid id);
        Task<bool> SlugExistsAsync(string slug);
        Task UpdateAsync(CategoryEntity category);
    }
}
