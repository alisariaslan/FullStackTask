using MassTransit;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using Shared.Kernel.IntegrationEvents;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Products.Commands.CreateProduct
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
    {
        private readonly IProductRepository _repository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IDistributedCache _cache;
        private readonly IImageService _imageService;
        private readonly IPublishEndpoint _publishEndpoint;
        public CreateProductCommandHandler(IProductRepository repository, ICategoryRepository categoryRepository, IDistributedCache cache, IImageService imageService, IPublishEndpoint publishEndpoint)
        {
            _repository = repository;
            _categoryRepository = categoryRepository;
            _cache = cache;
            _imageService = imageService;
            _publishEndpoint = publishEndpoint;
        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ValidationException(Messages.NameRequired);

            if (request.Price <= 0)
                throw new ValidationException(Messages.PriceInvalid);

            if (request.CategoryId == Guid.Empty)
                throw new ValidationException(Messages.CategoryRequired);

            var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
            if (category == null)
            {
                throw new ValidationException(Messages.CategoryNotFound);
            }

            string baseSlug = request.Name.ToSlug();
            string finalSlug = baseSlug;
            int counter = 1;

            while (await _repository.SlugExistsAsync(finalSlug))
            {
                finalSlug = $"{baseSlug}-{counter}";
                counter++;
            }

            string imageUrl;

            if (request.Image != null)
            {
                using var stream = request.Image.OpenReadStream();
                imageUrl = await _imageService.SaveImageAsync(stream, request.Image.FileName, cancellationToken);
            }
            else
            {
                imageUrl = await _imageService.SaveImageAsync(Stream.Null, "", cancellationToken);
            }

            var newProduct = new ProductEntity
            {
                Id = Guid.NewGuid(),
                Price = request.Price,
                Stock = request.Stock,
                CategoryId = request.CategoryId,
                ImageUrl = imageUrl,
                Translations = new List<ProductTranslationEntity>
                {
                    new ProductTranslationEntity
                    {
                        Id = Guid.NewGuid(),
                        LanguageCode =request.LanguageCode,
                        Name = request.Name,
                        Description = request.Description,
                        Slug = finalSlug
                    }
                }
            };

            await _repository.AddAsync(newProduct);

            await _cache.RemoveAsync($"all_products_{request.LanguageCode}", cancellationToken);

            await _publishEndpoint.Publish(new ProductCreatedEvent
            {
                Id = newProduct.Id,
                Name = request.Name,
                Description = request.Description,
                Price = newProduct.Price,
                Stock = newProduct.Stock,
                CategoryId = newProduct.CategoryId
            }, cancellationToken);

            return newProduct.Id;
        }
    }

}
