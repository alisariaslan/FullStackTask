using Services.Product.Application.Interfaces;
using Shared.Kernel.Extensions;

namespace Services.Product.Infrastructure.Services
{
    public class CategorySlugService : ICategorySlugService
    {
        private readonly ICategoryRepository _repository;

        public CategorySlugService(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> GenerateUniqueSlugAsync(string text, string languageCode)
        {
            var baseSlug = text.ToSlug();
            var slug = baseSlug;
            var counter = 1;

            while (await _repository.SlugExistsAsync(slug, languageCode))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            return slug;
        }
    }

}
