using MediatR;
using Services.Product.Application.Models;
using Shared.Kernel.Interfaces;

namespace Services.Product.Application.Features.Categories.Queries.GetAllCategories
{
    public class GetAllCategoriesQuery : IRequest<List<CategoryDto>>, ILocalizedRequest
    {
        public string LanguageCode { get; set; } = "en";
    }
}