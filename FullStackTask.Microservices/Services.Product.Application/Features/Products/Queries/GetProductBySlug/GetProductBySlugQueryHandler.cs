using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Products.Queries.GetProductBySlug
{
    /// <summary>
    /// Ürüne ait slug ı kullanarak ürünü getirmeyi sağlar
    /// </summary>
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
            // Redis anahtarımızı oluşturalım
            string cacheKey = $"product_{request.Slug}_{request.LanguageCode}";

            // Rediste zaten varsa direk dönüyoruz
            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<ProductDto>(cachedData);
            }

            // Slug ile ürünü arayalım
            var product = await _repository.GetBySlugAsync(request.Slug,request.LanguageCode);

            // Ürün bulunamadıysa süreç iptal
            if (product == null)
                return null;

            // Ürün adını getirelim dile göre
            var pTranslation = product.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode) 
                ?? product.Translations.FirstOrDefault();  // (Web ürününün kapsamına göre tartışılabilir)

            // Kategori adını getirelim dile göre
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

            // 20 dakika süreyle redis e kayıt edelim
            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) };
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions, cancellationToken);

            return result;
        }
    }
}
