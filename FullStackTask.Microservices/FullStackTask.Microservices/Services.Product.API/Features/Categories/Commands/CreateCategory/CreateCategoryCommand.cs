using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.API.Constants;
using Services.Product.API.Entities;
using Services.Product.API.Models;
using Services.Product.API.Repositories;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.API.Features.Categories.Commands.CreateCategory
{
    public class CreateCategoryCommand : IRequest<Guid>, ILocalizedRequest
    {
        public required string Name { get; set; }
        public string LanguageCode { get; set; } = "en";
    }

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
                        Slug = request.Name.ToLower().Replace(" ", "-")
                    }
                }
            };

            await _repository.AddAsync(newCategory);

            await _cache.RemoveAsync($"all_categories_{request.LanguageCode}", cancellationToken);

            return newCategory.Id;
        }
    }
}