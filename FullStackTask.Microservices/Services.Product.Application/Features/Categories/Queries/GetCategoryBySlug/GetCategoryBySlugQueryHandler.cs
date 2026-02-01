using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Categories.Queries.GetCategoryBySlug
{
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
            string cacheKey = $"category_{request.Slug}_{request.LanguageCode}";

            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<CategoryDto>(cachedData);
            }

            var category = await _repository.GetBySlugAsync(request.Slug, request.LanguageCode); //SEO SAFE
            if (category == null)
                return null;

            var cTranslation = category.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode);  //SEO SAFE
            if (cTranslation == null)
                return null;


            var result = new CategoryDto(
                category.Id,
                cTranslation?.Name ?? string.Empty,
                  cTranslation?.Slug ?? string.Empty
            );

            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) };

            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions, cancellationToken);

            return result;
        }
    }
}
