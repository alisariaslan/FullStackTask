using MediatR;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using StackExchange.Redis;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Products.Commands.AddProductTranslation
{
    public class AddProductTranslationCommandHandler : IRequestHandler<AddProductTranslationCommand, Unit>
    {
        private readonly IProductRepository _repository;
        private readonly IConnectionMultiplexer _redisConnection;

        public AddProductTranslationCommandHandler(IProductRepository repository, IConnectionMultiplexer redisConnection)
        {
            _repository = repository;
            _redisConnection = redisConnection;
        }

        public async Task<Unit> Handle(AddProductTranslationCommand request, CancellationToken cancellationToken)
        {
            var product = await _repository.GetByIdAsync(request.ProductId);
            if (product == null)
            {
                throw new ValidationException(Messages.ProductNotFound);
            }

            var existingTranslation = product.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode);
            if (existingTranslation != null)
            {
                throw new ValidationException(Messages.TranslationAlreadyExists);
            }

            string baseSlug = request.Name.ToSlug();
            string finalSlug = baseSlug;
            int counter = 1;

            while (await _repository.SlugExistsAsync(finalSlug))
            {
                finalSlug = $"{baseSlug}-{counter}";
                counter++;
            }

            var newTranslation = new ProductTranslationEntity
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                LanguageCode = request.LanguageCode,
                Name = request.Name,
                Description = request.Description,
                Slug = finalSlug
            };

            product.Translations.Add(newTranslation);

            await _repository.UpdateAsync(product);

            await _redisConnection.RemoveByPatternAsync("product*");

            return Unit.Value;
        }
    }

}
