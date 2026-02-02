using MediatR;
using Services.Product.Application.Models;

namespace Services.Product.Application.Features.Categories.Queries.GetCategoryBySlug
{
    public record GetCategoryBySlugQuery (
        string Slug,
        string LanguageCode
    ) : IRequest<CategoryDto?>;
}
