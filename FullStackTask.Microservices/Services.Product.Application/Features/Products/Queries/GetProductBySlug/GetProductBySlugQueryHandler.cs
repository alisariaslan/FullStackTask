using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Products.Queries.GetProductBySlug
{
    public class GetProductBySlugQueryHandler
        : IRequestHandler<GetProductBySlugQuery, ProductDto?>
    {
        private readonly IProductRepository _repository;
        private readonly IDistributedCache _cache;

        public GetProductBySlugQueryHandler(IProductRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<ProductDto?> Handle(
            GetProductBySlugQuery request,
            CancellationToken cancellationToken)
        {
            string cacheKey = $"product_{request.Slug}_{request.LanguageCode}";

            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<ProductDto>(cachedData);
            }

            var product = await _repository.GetBySlugAsync(request.Slug,request.LanguageCode);

            if (product == null) return null;


            var pTranslation = product.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode) 
                ?? product.Translations.FirstOrDefault();  // (Web ürününün kapsamına göre tartışılabilir)

            var cTranslation = product.Category?.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                ?? product.Category?.Translations.FirstOrDefault(); // (Web ürününün kapsamına göre tartışılabilir)

            var result = new ProductDto(
                product.Id,
                pTranslation?.Name ?? string.Empty,
                pTranslation?.Description ?? string.Empty,
                product.Price,
                product.Stock,
                product.ImageUrl,
                product.CategoryId,
                pTranslation?.Slug,
                cTranslation?.Name,
                    cTranslation?.Slug ?? string.Empty
            );

            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) };

            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions, cancellationToken);

            return result;
        }
    }
}
