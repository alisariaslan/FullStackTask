using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Products.Queries.GetAllProducts
{
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
            string cacheKey = $"products_{request.LanguageCode}_{request.SearchTerm}_{request.CategoryId}_{request.MinPrice}_{request.MaxPrice}_{request.SortBy}";

            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<List<ProductDto>>(cachedData)!;
            }

            var products = await _repository.GetAllAsync();

            var query = products.Select(p => {
                var pTranslation = p.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode) ?? p.Translations.FirstOrDefault();
                var cTranslation = p.Category?.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode) ?? p.Category?.Translations.FirstOrDefault();

                return new ProductDto(
                    p.Id,
                    pTranslation?.Name ?? "No Name",
                    pTranslation?.Description ?? string.Empty,
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    p.CategoryId,
                    cTranslation?.Name ?? "Uncategorized"
                );
            }).AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
                query = query.Where(x => x.Name.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase));

            if (request.CategoryId.HasValue)
                query = query.Where(x => x.CategoryId == request.CategoryId.Value);

            if (request.MinPrice.HasValue)
                query = query.Where(x => x.Price >= request.MinPrice.Value);

            if (request.MaxPrice.HasValue)
                query = query.Where(x => x.Price <= request.MaxPrice.Value);

            query = request.SortBy?.ToLower() switch
            {
                "price_asc" => query.OrderBy(x => x.Price),
                "price_desc" => query.OrderByDescending(x => x.Price),
                "name_desc" => query.OrderByDescending(x => x.Name),
                _ => query.OrderBy(x => x.Name)
            };

            var result = query.ToList();

            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) };
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions, cancellationToken);

            return result;
        }
    }

}
