using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using StackExchange.Redis;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Categories.Commands.CreateCategory
{
    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Guid>
    {
        private readonly ICategoryRepository _repository;
        private readonly IConnectionMultiplexer _redisConnection;
        private readonly ICategorySlugService _slugService;

        public CreateCategoryCommandHandler(ICategoryRepository repository,  IConnectionMultiplexer redisConnection, ICategorySlugService slugService)
        {
            _repository = repository;
            _redisConnection = redisConnection;
            _slugService = slugService;
        }

        public async Task<Guid> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ValidationException(Messages.NameRequired);

            var slug = await _slugService.GenerateUniqueSlugAsync(request.Name,request.LanguageCode);

            var newCatId = Guid.NewGuid();
            var newCategory = new CategoryEntity
            {
                Id = newCatId,
                Translations = new List<CategoryTranslationEntity>
                {
                    new CategoryTranslationEntity
                    {
                        Id = Guid.NewGuid(),
                        CategoryId = newCatId,
                        LanguageCode = request.LanguageCode,
                        Name = request.Name,
                       Slug = slug
                    }
                }
            };

            await _repository.AddAsync(newCategory);

            await _redisConnection.RemoveByPatternAsync("categor*");

            return newCategory.Id;
        }
    }
}
