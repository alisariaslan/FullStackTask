using MediatR;
using Microsoft.AspNetCore.Http;
using Shared.Kernel.Interfaces;

namespace Services.Product.Application.Features.Products.Commands.CreateProduct
{
    public class CreateProductCommand : IRequest<Guid>, ILocalizedRequest
    {
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }
        public int Stock { get; set; }
        public Guid CategoryId { get; set; }
        public IFormFile? Image { get; set; }
        public string LanguageCode { get; set; } = "en";
    }

    
}