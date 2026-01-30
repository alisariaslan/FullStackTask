using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Products.Queries.GetProductById
{
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
    {
        private readonly IProductRepository _repository;
        private readonly IDistributedCache _cache;

        public GetProductByIdQueryHandler(IProductRepository repository,IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            string cacheKey = $"product_{request.Id}_{request.LanguageCode}";

            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<ProductDto>(cachedData);
            }

            var product = await _repository.GetByIdAsync(request.Id);

            if (product == null) return null;

            var pTranslation = product.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                               ?? product.Translations.FirstOrDefault();

            var cTranslation = product.Category?.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                               ?? product.Category?.Translations.FirstOrDefault();

            var result = new ProductDto(
                 product.Id,
                 pTranslation?.Name ?? "No Name",
                 pTranslation?.Description ?? string.Empty,
                 product.Price,
                 product.Stock,
                 product.ImageUrl,
                 product.CategoryId,
                 cTranslation?.Name ?? "Uncategorized"
             );

            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) };
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions, cancellationToken);

            return result;
        }
    }

}
