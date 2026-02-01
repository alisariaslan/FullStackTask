using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using StackExchange.Redis;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Categories.Commands.AddCategoryTranslation
{
    public class AddCategoryTranslationCommandHandler : IRequestHandler<AddCategoryTranslationCommand, Unit>
    {
        private readonly ICategoryRepository _repository;
        private readonly IConnectionMultiplexer _redisConnection;
        private readonly ICategorySlugService _slugService;

        public AddCategoryTranslationCommandHandler(ICategoryRepository repository,  IConnectionMultiplexer redisConnection, ICategorySlugService slugService)
        {
            _repository = repository;
            _redisConnection = redisConnection;
            _slugService = slugService;
        }

        public async Task<Unit> Handle(AddCategoryTranslationCommand request, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(request.CategoryId);
            if (category == null) throw new ValidationException(Messages.CategoryNotFound);

            if (category.Translations.Any(t => t.LanguageCode == request.LanguageCode))
                throw new ValidationException(Messages.TranslationAlreadyExists);

            var slug = await _slugService.GenerateUniqueSlugAsync(request.Name,request.LanguageCode);

            category.Translations.Add(new CategoryTranslationEntity
            {
                Id = Guid.NewGuid(),
                CategoryId = category.Id,
                LanguageCode = request.LanguageCode,
                Name = request.Name,
                Slug = slug
            });

            await _repository.UpdateAsync(category);

            await _redisConnection.RemoveByPatternAsync("categor*");

            return Unit.Value;
        }
    }
}
