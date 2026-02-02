using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Categories.Queries.GetAllCategories
{
    /// <summary>
    /// Kategorilerin tümünü döndürür
    /// </summary>
    public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, List<CategoryDto>>
    {
        private readonly ICategoryRepository _repository;
        private readonly IDistributedCache _cache;

        public GetAllCategoriesQueryHandler(ICategoryRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<List<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
        {
            // Redis key hazırlanır
            string cacheKey = $"categories_{request.LanguageCode}";

            // Redisden cache çekilir
            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);

            // Cache varsa deserialize edilir, client a döndürülür.
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<List<CategoryDto>>(cachedData)!;
            }

            // Tüm kategoriler getirir
            var categories = await _repository.GetAllAsync();

            // Kategorilerin isim çevrilerini alalım
            var categoryDtos = categories.Select(c => {
                var translation = c.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                                  ?? c.Translations.FirstOrDefault(); // (Web ürününün kapsamına göre tartışılabilir)

                return new CategoryDto(
                    c.Id,
                    translation?.Name ?? string.Empty,
                    translation?.Slug ?? string.Empty
                );
            }).ToList();

            // 20 dakika ya cacheden silinsin
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20)
            };

            // Cache e atıyoruz sonucumuzu
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(categoryDtos), cacheOptions, cancellationToken);

            return categoryDtos;
        }
    }
}
