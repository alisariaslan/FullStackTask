using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;
using System.Text.Json;

namespace Services.Product.Application.Features.Products.Queries.GetProductById
{
    /// <summary>
    /// Ürün ID değerine göre ürünü döndürür
    /// </summary>
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
            // Bellek anahtarımız
            string cacheKey = $"product_{request.Id}_{request.LanguageCode}";

            // Bellekte zaten varsa direk dönüyoruz
            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<ProductDto>(cachedData);
            }

            // Veritabanından ürünü ID ile arıyoruz
            var product = await _repository.GetByIdAsync(request.Id);

            // Bulamadıysak süreç iptal
            if (product == null) 
                return null;

            // Çevrimini yapıyoruz
            var pTranslation = product.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                               ?? product.Translations.FirstOrDefault();    // (Web ürününün kapsamına göre tartışılabilir)

            // Kategori çevrimini de yapıyoruz
            var cTranslation = product.Category?.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                               ?? product.Category?.Translations.FirstOrDefault();  // (Web ürününün kapsamına göre tartışılabilir)

            var result = new ProductDto(
                 product.Id,
                 pTranslation?.Name ?? string.Empty,
                 pTranslation?.Description ?? string.Empty,
                 product.Price,
                 product.Stock,
                 product.ImageUrl,
                 product.CategoryId,
                 pTranslation?.Slug ?? string.Empty,
                 cTranslation?.Name ?? string.Empty,
                     cTranslation?.Slug ?? string.Empty
             );

            // Redis e 20 dakika süreyle kayıt ediyoruz
            var cacheOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20) };
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result), cacheOptions, cancellationToken);

            return result;
        }
    }

}
