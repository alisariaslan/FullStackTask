using MediatR;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Shared.Kernel.Constants;
using Shared.Kernel.Extensions;
using StackExchange.Redis;
using System.ComponentModel.DataAnnotations;

namespace Services.Product.Application.Features.Categories.Commands.AddCategoryTranslation
{
    /// <summary>
    /// Kategoriye çeviri ekler. Unique slug oluşturur.
    /// </summary>
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
            // Kategoriyi id ile getirir
            var category = await _repository.GetByIdAsync(request.CategoryId);

            // Kategori yoksa bulunamadı hatası fırlatır
            if (category == null) 
                throw new ValidationException(Messages.CategoryNotFound);

            // Eğer gelen dil kodu tabloda varsa zaten çevrilmiş demektir
            if (category.Translations.Any(t => t.LanguageCode == request.LanguageCode))
                throw new ValidationException(Messages.TranslationAlreadyExists);

            // Unique slug üretir
            var slug = await _slugService.GenerateUniqueSlugAsync(request.Name,request.LanguageCode);

            // Yeni çeviriyi kategoriye ekler
            category.Translations.Add(new CategoryTranslationEntity
            {
                Id = Guid.NewGuid(),
                CategoryId = category.Id,
                LanguageCode = request.LanguageCode,
                Name = request.Name,
                Slug = slug
            });

            // Kategori güncellenir
            await _repository.UpdateAsync(category);

            // Tüm kategori patternine sahip redis cache boşaltılır. (Daha optimize edilebilir)
            await _redisConnection.RemoveByPatternAsync("categor*");

            return Unit.Value;
        }
    }
}
