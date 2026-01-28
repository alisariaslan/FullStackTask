using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.API.Models;
using Services.Product.API.Repositories;
using System.Text.Json;

namespace Services.Product.API.Features.Products.Queries.GetAllProducts
{
    public class GetAllProductsQuery : IRequest<List<ProductDto>>, ILocalizedRequest
    {
        public string LanguageCode { get; set; } = "en";
    }

    public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
    {
        private readonly IProductRepository _repository;
        private readonly IDistributedCache _cache;

        public GetAllProductsQueryHandler(IProductRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<List<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
        {
            string cacheKey = $"all_products_{request.LanguageCode}";
            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);

            // Cache'de varsa
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<List<ProductDto>>(cachedData)!;
            }

            // Cache boşsa
            var products = await _repository.GetAllAsync();

            var productDtos = products.Select(p => {
                // Ürün çevirisi
                var pTranslation = p.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                                  ?? p.Translations.FirstOrDefault();

                // Kategori çevirisi
                var cTranslation = p.Category?.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                                  ?? p.Category?.Translations.FirstOrDefault();

                return new ProductDto(
                    p.Id,
                    pTranslation?.Name ?? "No Name",
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    p.CategoryId,
                    cTranslation?.Name ?? "Uncategorized" 
                );
            }).ToList();

            // Redis'e kaydet
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20)
            };

            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(productDtos), cacheOptions, cancellationToken);

            return productDtos;
        }
    }
}
