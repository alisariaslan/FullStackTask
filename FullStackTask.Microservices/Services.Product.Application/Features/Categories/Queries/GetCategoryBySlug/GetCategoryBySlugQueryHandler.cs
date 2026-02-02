using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Categories.Queries.GetCategoryBySlug
{
    /// <summary>
    /// Kategoriyi slug verisinden getirir
    /// </summary>
    public class GetCategoryBySlugQueryHandler
       : IRequestHandler<GetCategoryBySlugQuery, CategoryDto?>
    {
        private readonly ICategoryRepository _repository;
        private readonly IDistributedCache _cache;

        public GetCategoryBySlugQueryHandler(ICategoryRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<CategoryDto?> Handle(
            GetCategoryBySlugQuery request,
            CancellationToken cancellationToken)
        {
            // Cache veri isimlendirmesi oluşturuyoruz
            string cacheKey = $"category_{request.Slug}_{request.LanguageCode}";

            // Cache den arayıp döndürüyoruz eğer cache de varsa
            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<CategoryDto>(cachedData);
            }

            // Slug ile kategoriyi bulmaya çalışalım yoksa null döndürüyoruz
            var category = await _repository.GetBySlugAsync(request.Slug, request.LanguageCode);
            if (category == null)
                return null;

            // Kategori çevrim verisini setliyoruz. Fallback olarak herhangi bir dil çevrimi dönüyoruz.
            var cTranslation = category.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)  
                ?? category.Translations.FirstOrDefault(); // (Web ürününün kapsamına göre tartışılabilir)

            // Dönecek sonucumuzu oluşturuyoruz
            var result = new CategoryDto(
                category.Id,
                cTranslation?.Name ?? string.Empty,
                  cTranslation?.Slug ?? string.Empty
            );

            // Verinin silinme süresini 20 dakika  olarak ayarlıyoruz.
            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) };

            // Belleğe verimizi atıyoruz
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions, cancellationToken);

            return result;
        }
    }
}
