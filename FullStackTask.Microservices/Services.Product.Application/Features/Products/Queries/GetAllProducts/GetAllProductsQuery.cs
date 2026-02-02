using MediatR;
using Services.Product.Application.Models;
using Shared.Kernel.Interfaces;
using Shared.Kernel.Models;

namespace Services.Product.Application.Features.Products.Queries.GetAllProducts
{
    public class GetAllProductsQuery : IRequest<PaginatedResult<ProductDto>>, ILocalizedRequest
    {
        public string LanguageCode { get; set; } = "en";
        public string? SearchTerm { get; set; }
        public Guid? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? SortBy { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
