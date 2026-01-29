using MediatR;
using Shared.Kernel.Interfaces;

namespace Services.Product.Application.Features.Products.Commands.AddProductTranslation
{
    public class AddProductTranslationCommand : IRequest<Unit>, ILocalizedRequest
    {
        public Guid ProductId { get; set; } 
        public required string LanguageCode { get; set; }
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;
    }

  
}
