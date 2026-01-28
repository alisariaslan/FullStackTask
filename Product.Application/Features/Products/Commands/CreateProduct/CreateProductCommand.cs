using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Product.Application.Constants;
using Product.Application.Interfaces;
using Product.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace Product.Application.Features.Products.Commands.CreateProduct
{
    public class CreateProductCommand : IRequest<Guid>, ILocalizedRequest
    {
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public Guid CategoryId { get; set; }
        public IFormFile? Image { get; set; }
        public string LanguageCode { get; set; } = "en";
    }

    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
    {
        private readonly IProductRepository _repository;
        private readonly IDistributedCache _cache;
        private readonly IImageService _imageService; 

        public CreateProductCommandHandler(IProductRepository repository, IDistributedCache cache, IImageService imageService)
        {
            _repository = repository;
            _cache = cache;
            _imageService = imageService;
        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ValidationException(Messages.NameRequired);

            if (request.Price <= 0)
                throw new ValidationException(Messages.PriceInvalid);

            if (request.CategoryId == Guid.Empty)
                throw new ValidationException(Messages.CategoryRequired);

            string imageUrl = await _imageService.SaveImageAsync(request.Image, cancellationToken);

            var newProduct = new ProductEntity
            {
                Id = Guid.NewGuid(),
                Price = request.Price,
                Stock = request.Stock,
                CategoryId = request.CategoryId,
                ImageUrl = imageUrl,
                Category = null!,
                Translations = new List<ProductTranslationEntity>
                {
                    new ProductTranslationEntity
                    {
                        Id = Guid.NewGuid(),
                        LanguageCode =request.LanguageCode,
                        Name = request.Name,
                        Slug = request.Name.ToLower().Replace(" ", "-")
                    }
                }
            };

            await _repository.AddAsync(newProduct);

            await _cache.RemoveAsync($"all_products_{request.LanguageCode}", cancellationToken);

            return newProduct.Id;
        }
    }
}