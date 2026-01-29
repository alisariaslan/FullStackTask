using MediatR;
using Services.Product.Application.Models;
using Shared.Kernel.Interfaces;

namespace Services.Product.Application.Features.Products.Queries.GetAllProducts
{
    public class GetAllProductsQuery : IRequest<List<ProductDto>>, ILocalizedRequest
    {
        public string LanguageCode { get; set; } = "en";
    }

    
}
