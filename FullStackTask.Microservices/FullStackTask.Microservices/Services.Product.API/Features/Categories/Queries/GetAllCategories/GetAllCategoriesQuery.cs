using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Product.Application.DTOs;
using Product.Application.Interfaces;
using System.Text.Json;

namespace Services.Product.API.Features.Categories.Queries.GetAllCategories
{
    public class GetAllCategoriesQuery : IRequest<List<CategoryDto>>, ILocalizedRequest
    {
        public string LanguageCode { get; set; } = "en";
    }

    public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, List<CategoryDto>>
    {
        private readonly ICategoryRepository _repository;
        private readonly IDistributedCache _cache;

        public GetAllCategoriesQueryHandler(ICategoryRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<List<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
        {
            string cacheKey = $"all_categories_{request.LanguageCode}";
            var cachedData = await _cache.GetStringAsync(cacheKey, cancellationToken);

            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<List<CategoryDto>>(cachedData)!;
            }

            var categories = await _repository.GetAllAsync();

            var categoryDtos = categories.Select(c => {

                var translation = c.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                                  ?? c.Translations.FirstOrDefault();

                return new CategoryDto(
                    c.Id,
                    translation?.Name ?? "No Name",
                    translation?.Slug ?? string.Empty
                );
            }).ToList();

            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(20)
            };

            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(categoryDtos), cacheOptions, cancellationToken);

            return categoryDtos;
        }
    }
}