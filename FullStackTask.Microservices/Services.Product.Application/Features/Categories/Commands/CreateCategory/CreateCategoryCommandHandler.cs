using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Categories.Commands.CreateCategory
{
    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Guid>
    {
        private readonly ICategoryRepository _repository;
        private readonly IDistributedCache _cache;

        public CreateCategoryCommandHandler(ICategoryRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<Guid> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ValidationException(Messages.NameRequired);

            string baseSlug = request.Name.ToSlug();
            string finalSlug = baseSlug;
            int counter = 1;

            while (await _repository.SlugExistsAsync(finalSlug))
            {
                finalSlug = $"{baseSlug}-{counter}";
                counter++;
            }

            var newCategory = new CategoryEntity
            {
                Id = Guid.NewGuid(),
                Translations = new List<CategoryTranslationEntity>
                {
                    new CategoryTranslationEntity
                    {
                        Id = Guid.NewGuid(),
                        LanguageCode = request.LanguageCode,
                        Name = request.Name,
                       Slug = finalSlug
                    }
                }
            };

            await _repository.AddAsync(newCategory);

            await _cache.RemoveAsync($"all_categories_{request.LanguageCode}", cancellationToken);

            return newCategory.Id;
        }
    }
}
