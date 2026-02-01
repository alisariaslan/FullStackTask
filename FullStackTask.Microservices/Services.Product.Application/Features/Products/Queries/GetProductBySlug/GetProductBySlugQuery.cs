using MediatR;
using Services.Product.Application.Models;

namespace Services.Product.Application.Features.Products.Queries.GetProductBySlug
{
    public record GetProductBySlugQuery(
        string Slug,
        string LanguageCode
    ) : IRequest<ProductDto?>;
}
