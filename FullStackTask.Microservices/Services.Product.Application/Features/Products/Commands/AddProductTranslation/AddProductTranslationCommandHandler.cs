using MediatR;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using StackExchange.Redis;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Products.Commands.AddProductTranslation
{
    /// <summary>
    /// Ürüne çevrim verisi ekler
    /// </summary>
    public class AddProductTranslationCommandHandler : IRequestHandler<AddProductTranslationCommand, Unit>
    {
        private readonly IProductRepository _repository;
        private readonly IProductSlugService _slugService;
        private readonly IConnectionMultiplexer _redisConnection;

        public AddProductTranslationCommandHandler(IProductRepository repository, IProductSlugService 
            slugService, IConnectionMultiplexer redisConnection)
        {
            _repository = repository;
            _slugService = slugService;
            _redisConnection = redisConnection;
        }

        public async Task<Unit> Handle(AddProductTranslationCommand request, CancellationToken cancellationToken)
        {
            // Id üzerinden veritabanında ürün var mı kontrolü yapıyoruz
            var product = await _repository.GetByIdAsync(request.ProductId);
            if (product == null)
                throw new ValidationException(Messages.ProductNotFound);

            // Eğer çevrim daha önce eklenmişse belirtiyoruz
            if (product.Translations.Any(t => t.LanguageCode == request.LanguageCode))
                throw new ValidationException(Messages.TranslationAlreadyExists);

            // Uniq slug değeri oluşturuyoruz
            var slug = await _slugService.GenerateUniqueSlugAsync(request.Name,request.LanguageCode);

            var newTranslation = new ProductTranslationEntity
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                LanguageCode = request.LanguageCode,
                Name = request.Name,
                Description = request.Description,
                Slug = slug
            };
            
            // Çevrimi ürüne ekliyoruz
            product.Translations.Add(newTranslation);

            // Ürünü güncelliyoruz
            await _repository.UpdateAsync(product);

            // Cachedeki ürünlere ait tüm verileri sıfırlıyoruz (Daha gelişmiş yöntemler kullanılabilir)
            await _redisConnection.RemoveByPatternAsync("product*");

            return Unit.Value;
        }
    }

}
