using MediatR;
using Services.Product.Application.Models;
using Shared.Kernel.Interfaces;

namespace Services.Product.Application.Features.Products.Queries.GetProductById
{
    public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto?>, ILocalizedRequest
    {
        public string LanguageCode { get; set; } = "en";
    }

   
}