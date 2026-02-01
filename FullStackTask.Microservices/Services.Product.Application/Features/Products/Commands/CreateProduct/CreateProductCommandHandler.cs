using MassTransit;
using MediatR;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using Shared.Kernel.IntegrationEvents;
using StackExchange.Redis;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Products.Commands.CreateProduct
{
    /// <summary>
    /// Ürün oluşturmayı sağlar
    /// </summary>
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
    {
        private readonly IProductRepository _repository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IConnectionMultiplexer _redisConnection;
        private readonly IImageService _imageService;
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly IProductSlugService _slugService;
        public CreateProductCommandHandler(IProductRepository repository, ICategoryRepository categoryRepository, IConnectionMultiplexer redisConnection, IImageService imageService, IPublishEndpoint publishEndpoint, IProductSlugService slugService)
        {
            _repository = repository;
            _categoryRepository = categoryRepository;
            _redisConnection = redisConnection;
            _imageService = imageService;
            _publishEndpoint = publishEndpoint;
            _slugService = slugService;
        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            // İsim kontrolü
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ValidationException(Messages.NameRequired);

            // Fiyat kontrolü
            if (request.Price <= 0)
                throw new ValidationException(Messages.PriceInvalid);

            // Kategori mevcut mu kontrolü
            if (request.CategoryId == Guid.Empty)
                throw new ValidationException(Messages.CategoryRequired);

            // Kategori veritabanında var mı kontrolü
            var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
            if (category == null)
            {
                throw new ValidationException(Messages.CategoryNotFound);
            }

            // Uniq slug oluşturuyoruz
            var slug = await _slugService.GenerateUniqueSlugAsync(request.Name,request.LanguageCode);

            // Resim varsa kayıt ediyoruz
            string imageUrl = string.Empty;
            if (request.Image != null)
            {
                using var stream = request.Image.OpenReadStream();
                imageUrl = await _imageService.SaveImageAsync(stream, request.Image.FileName, cancellationToken);
            }

            var newProdId = Guid.NewGuid();
            var newProduct = new ProductEntity
            {
                Id = newProdId,
                Price = request.Price,
                Stock = request.Stock,
                CategoryId = request.CategoryId,
                ImageUrl = imageUrl ,
                Translations = new List<ProductTranslationEntity>
                {
                    new ProductTranslationEntity
                    {
                        Id = Guid.NewGuid(),
                        ProductId = newProdId,
                        LanguageCode =request.LanguageCode,
                        Name = request.Name,
                        Description = request.Description,
                        Slug = slug
                    }
                }
            };

            // Ürünü veritabanına kayıt ediyoruz
            await _repository.AddAsync(newProduct);

            // Bütün ürün cachelerini temizliyoruz (Daha etkin yöntemler kullanılabilir)
            await _redisConnection.RemoveByPatternAsync("product*");

            // Ürün oluşturuldu bildirimi gönderiyoruz
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
