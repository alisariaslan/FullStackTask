using Services.Product.Domain.Entities;

namespace Services.Product.Application.Interfaces
{
    public interface ICategoryRepository
    {
        /// <summary>
        /// Kategoriyi slug verisine göre getirir
        /// </summary>
        /// <param name="slug"></param>
        /// <param name="languageCode">Öncelikli dil</param>
        /// <returns></returns>
        Task<CategoryEntity?> GetBySlugAsync(string slug, string languageCode);
        /// <summary>
        /// Tüm kategorileri getirir
        /// </summary>
        /// <returns></returns>
        Task<List<CategoryEntity>> GetAllAsync();
        /// <summary>
        /// Yeni kategori ekler
        /// </summary>
        /// <param name="category"></param>
        /// <returns></returns>
        Task AddAsync(CategoryEntity category);
        /// <summary>
        /// Id ye göre kategori getirir
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<CategoryEntity?> GetByIdAsync(Guid id);
        /// <summary>
        /// Böyle bir slug var mı kontrolü yapar
        /// </summary>
        /// <param name="slug"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        Task<bool> SlugExistsAsync(string slug, string languageCode);
        /// <summary>
        /// Kategoriyi günceller
        /// </summary>
        /// <param name="category"></param>
        /// <returns></returns>
        Task UpdateAsync(CategoryEntity category);
    }
}
