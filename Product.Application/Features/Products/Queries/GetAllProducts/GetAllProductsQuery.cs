using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Product.Application.DTOs;
using Product.Application.Interfaces;
using System.Text.Json;

namespace Product.Application.Features.Products.Queries.GetAllProducts
{
    public class GetAllProductsQuery : IRequest<List<ProductDto>> { }

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
            string cacheKey = "all_products";
            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);

            // Cache'de varsa
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<List<ProductDto>>(cachedData)!;
            }

            // Cache boşsa
            var products = await _repository.GetAllAsync();
            var productDtos = products.Select(p => new ProductDto(p.Id, p.Name, p.Price, p.Stock)).ToList();

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
