using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using Shared.Kernel.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Products.Queries.GetAllProducts
{
    public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, PaginatedResult<ProductDto>>
    {
        private readonly IProductRepository _repository;
        private readonly IDistributedCache _cache;

        public GetAllProductsQueryHandler(IProductRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<PaginatedResult<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
        {
            string cacheKey = $"products_{request.LanguageCode}_{request.PageNumber}_{request.PageSize}_{request.SearchTerm}_{request.CategoryId}_{request.MinPrice}_{request.MaxPrice}_{request.SortBy}";

            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<PaginatedResult<ProductDto>>(cachedData)!;
            }

            var pagedEntities = await _repository.GetFilteredProductsAsync(
                request.LanguageCode, request.SearchTerm, request.CategoryId,
                request.MinPrice, request.MaxPrice, request.SortBy,
                request.PageNumber, request.PageSize);

            var dtos = pagedEntities.Items.Select(p => {
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
            }).ToList();

            var result = new PaginatedResult<ProductDto>(dtos, pagedEntities.TotalCount, pagedEntities.PageNumber, pagedEntities.PageSize);

            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) };
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions, cancellationToken);

            return result;
        }
    
}

}
