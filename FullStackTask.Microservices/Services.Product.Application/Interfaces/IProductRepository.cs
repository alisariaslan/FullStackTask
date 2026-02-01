using Services.Product.Domain.Entities;
using Shared.Kernel.Models;

namespace Services.Product.Application.Interfaces
{
    public interface IProductRepository
    {
        /// <summary>
        /// Slug verisine göre ürünü getirir
        /// </summary>
        /// <param name="slug"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        Task<ProductEntity?> GetBySlugAsync(string slug, string languageCode);
        /// <summary>
        /// Ürünü ekler
        /// </summary>
        /// <param name="product"></param>
        /// <returns></returns>
        Task AddAsync(ProductEntity product);
        /// <summary>
        /// Ürünü Id sine göre getirir
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<ProductEntity?> GetByIdAsync(Guid id);
        /// <summary>
        /// Slug değeri var mı kontrolü yapar
        /// </summary>
        /// <param name="slug"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        Task<bool> SlugExistsAsync(string slug, string languageCode);
        /// <summary>
        /// Ürünü günceller
        /// </summary>
        /// <param name="product"></param>
        /// <returns></returns>
        Task UpdateAsync(ProductEntity product);
        /// <summary>
        /// Ürünü filtreleyerek getirir
        /// </summary>
        /// <param name="languageCode">Dil</param>
        /// <param name="searchTerm">Aranan yazı</param>
        /// <param name="categoryId"></param>
        /// <param name="minPrice"></param>
        /// <param name="maxPrice"></param>
        /// <param name="sortBy"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        Task<PaginatedResult<ProductEntity>> GetFilteredProductsAsync(
        string languageCode, string? searchTerm, Guid? categoryId,
        decimal? minPrice, decimal? maxPrice, string? sortBy,
        int pageNumber, int pageSize);
    }
}
