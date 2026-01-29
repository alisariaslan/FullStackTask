using MediatR;
using Shared.Kernel.Interfaces;

namespace Services.Product.Application.Features.Categories.Commands.AddCategoryTranslation
{
    public class AddCategoryTranslationCommand : IRequest<Unit>, ILocalizedRequest
    {
        public Guid CategoryId { get; set; }
        public required string LanguageCode { get; set; }
        public required string Name { get; set; }
    }
}
