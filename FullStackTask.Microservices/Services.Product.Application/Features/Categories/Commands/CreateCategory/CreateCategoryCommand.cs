using MediatR;
using Shared.Kernel.Interfaces;

namespace Services.Product.Application.Features.Categories.Commands.CreateCategory
{
    public class CreateCategoryCommand : IRequest<Guid>, ILocalizedRequest
    {
        public required string Name { get; set; }
        public string LanguageCode { get; set; } = "en";
    }

   
}