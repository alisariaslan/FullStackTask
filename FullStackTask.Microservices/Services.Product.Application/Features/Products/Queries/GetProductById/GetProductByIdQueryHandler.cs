using MediatR;
using Services.Product.Application.Interfaces;
using Services.Product.Application.Models;

namespace Services.Product.Application.Features.Products.Queries.GetProductById
{
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDto?>
    {
        private readonly IProductRepository _repository;

        public GetProductByIdQueryHandler(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            var product = await _repository.GetByIdAsync(request.Id);

            if (product == null) return null;

            var pTranslation = product.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                               ?? product.Translations.FirstOrDefault();

            var cTranslation = product.Category?.Translations.FirstOrDefault(t => t.LanguageCode == request.LanguageCode)
                               ?? product.Category?.Translations.FirstOrDefault();

            return new ProductDto(
                product.Id,
                pTranslation?.Name ?? "No Name",
                pTranslation?.Description ?? string.Empty,
                product.Price,
                product.Stock,
                product.ImageUrl,
                product.CategoryId,
                cTranslation?.Name ?? "Uncategorized"
            );
        }
    }

}
