using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using Shared.Kernel.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Products.Queries.GetAllProducts
{
    /// <summary>
    /// Tüm ürünleri filtreler (parametreler) ile getirmeyi sağlar
    /// </summary>
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
            // Arama yazısını güvenli hale getiriyoruz
            var normalizedSearch = request.SearchTerm?.Trim().ToLower();

            // Ürün bellek anahtarını oluşturuyoruz
            string cacheKey = $"products_{request.LanguageCode}_{request.PageNumber}_{request.PageSize}_{normalizedSearch}_{request.CategoryId}_{request.MinPrice}_{request.MaxPrice}_{request.SortBy}";

            // Daha önceden böyle bir şey aratılmışsa direk döndürüyoruz
            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<PaginatedResult<ProductDto>>(cachedData)!;
            }

            // Filtrelere göre ürünleri getiriyoruz
            var pagedEntities = await _repository.GetFilteredProductsAsync(
                request.LanguageCode, normalizedSearch, request.CategoryId,
                request.MinPrice, request.MaxPrice, request.SortBy,
                request.PageNumber, request.PageSize);

            // Dil kapsamına göre çevirileri getiriyoruz
            var dtos = pagedEntities.Items.Select(p => {
                var pTranslation = p.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode) 
                ?? p.Translations.FirstOrDefault(); //  (Web ürününün kapsamına göre tartışılabilir)

                // Dil kapsamına göre kategori çevrimini yapıyoruz
                var cTranslation = p.Category?.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode) 
                ?? p.Category?.Translations.FirstOrDefault();  // (Web ürününün kapsamına göre tartışılabilir)

                return new ProductDto(
                    p.Id,
                    pTranslation?.Name ?? string.Empty,
                    pTranslation?.Description ?? string.Empty,
                    p.Price,
                    p.Stock,
                    p.ImageUrl,
                    p.CategoryId,
                    pTranslation?.Slug ?? string.Empty,
                    cTranslation?.Name ?? string.Empty,
                       cTranslation?.Slug ?? string.Empty
                );
            }).ToList();

            var result = new PaginatedResult<ProductDto>(dtos, pagedEntities.TotalCount, pagedEntities.PageNumber, pagedEntities.PageSize);

            // 20 dakika sonra silinecek şekilde belleğe koyuyoruz sonucumuzu dönmeden önce
            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) };
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions, cancellationToken);

            return result;
        }
    
}

}
