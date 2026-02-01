using Services.Product.Application.Interfaces;
using Shared.Kernel.Extensions;

namespace Services.Product.Infrastructure.Services
{
    public class ProductSlugService : IProductSlugService
    {
        private readonly IProductRepository _repository;

        public ProductSlugService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> GenerateUniqueSlugAsync(string text, string languageCode)
        {
            var baseSlug = text.ToSlug();
            var slug = baseSlug;
            var counter = 1;

            while (await _repository.SlugExistsAsync(slug,languageCode))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            return slug;
        }
    }

}
