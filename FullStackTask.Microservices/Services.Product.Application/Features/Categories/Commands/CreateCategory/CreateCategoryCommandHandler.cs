using MediatR;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using StackExchange.Redis;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Categories.Commands.CreateCategory
{
    /// <summary>
    /// Yeni kategori oluşturur. Unique slug ekler.
    /// </summary>
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
            // Client tarafından gelen kategori adlandırması kontrol edilir.
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ValidationException(Messages.NameRequired);

            // Kategori adına göre unique bir slug üretilir
            var slug = await _slugService.GenerateUniqueSlugAsync(request.Name,request.LanguageCode);

            // Yeni kategori oluşturulur
            var newCatId = Guid.NewGuid();
            var newCategory = new CategoryEntity
            {
                Id = newCatId,
                Translations = new List<CategoryTranslationEntity> 
                {
                    // Kategori adı çeviri şeklinde eklenir
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

            // Veritabanına eklenir
            await _repository.AddAsync(newCategory);

            // Cache den bütün categor... diye devam eden bellek verisi temizlenir. (Bu yöntem daha profesyonel yapılabilir)
            await _redisConnection.RemoveByPatternAsync("categor*");

            return newCategory.Id;
        }
    }
}
