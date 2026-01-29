using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Categories.Commands.AddCategoryTranslation
{
    public class AddCategoryTranslationCommandHandler : IRequestHandler<AddCategoryTranslationCommand, Unit>
    {
        private readonly ICategoryRepository _repository;
        private readonly IDistributedCache _cache;

        public AddCategoryTranslationCommandHandler(ICategoryRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<Unit> Handle(AddCategoryTranslationCommand request, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(request.CategoryId);
            if (category == null) throw new ValidationException(Messages.CategoryNotFound);

            if (category.Translations.Any(t => t.LanguageCode == request.LanguageCode))
                throw new ValidationException(Messages.TranslationAlreadyExists);

            // Slug oluşturma
            string baseSlug = request.Name.ToSlug();
            string finalSlug = baseSlug;
            int counter = 1;

            while (await _repository.SlugExistsAsync(finalSlug))
            {
                finalSlug = $"{baseSlug}-{counter}";
                counter++;
            }

            category.Translations.Add(new CategoryTranslationEntity
            {
                Id = Guid.NewGuid(),
                CategoryId = category.Id,
                LanguageCode = request.LanguageCode,
                Name = request.Name,
                Slug = finalSlug
            });

            await _repository.UpdateAsync(category);
            await _cache.RemoveAsync($"all_categories_{request.LanguageCode}", cancellationToken);

            return Unit.Value;
        }
    }
}
