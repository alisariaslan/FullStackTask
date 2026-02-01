using Services.Product.Domain.Entities;

namespace Services.Product.Application.Interfaces
{
    public interface ICategoryRepository
    {
        Task<CategoryEntity?> GetBySlugAsync(string slug, string languageCode);
        Task<List<CategoryEntity>> GetAllAsync();
        Task AddAsync(CategoryEntity category);
        Task<CategoryEntity?> GetByIdAsync(Guid id);
        Task<bool> SlugExistsAsync(string slug, string languageCode);
        Task UpdateAsync(CategoryEntity category);
    }
}
