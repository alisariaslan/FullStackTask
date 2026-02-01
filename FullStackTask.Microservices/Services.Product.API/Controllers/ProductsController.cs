using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Product.Application.Features.Products.Commands.AddProductTranslation;
using Services.Product.Application.Features.Products.Commands.CreateProduct;
using Services.Product.Application.Features.Products.Queries.GetAllProducts;
using Services.Product.Application.Features.Products.Queries.GetProductBySlug;
using Services.Product.Application.Models;
using Shared.Kernel.Constants;
using Shared.Kernel.Models;

namespace Services.Product.API.Controllers
{
    /// <summary>
    /// Ürünleri yöneten kontrolcü sınıf
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Tüm ürünleri filtrelere (parametrelere) göre getirir.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<PaginatedResult<ProductDto>>>> GetAll([FromQuery] GetAllProductsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(ApiResponse<PaginatedResult<ProductDto>>.Success(result));
        }

        /// <summary>
        /// Yeni ürün oluşturur. Unique slug verisi oluşturur. (Admin)
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ApiResponse<Guid>>> Create([FromForm] CreateProductCommand command)
        {
            var id = await _mediator.Send(command);
            return Ok(ApiResponse<Guid>.Success(id));
        }

        /// <summary>
        /// Ürünü slug verisine göre getirir
        /// </summary>
        /// <param name="slug"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        [HttpGet("by-slug/{slug}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> GetBySlug( string slug,[FromQuery] string languageCode = "en")
        {
            var result = await _mediator.Send(
                new GetProductBySlugQuery(slug, languageCode)
            );

            if (result == null)
                return NotFound(ApiResponse<ProductDto>.Fail(Messages.ProductNotFound));

            return Ok(ApiResponse<ProductDto>.Success(result));
        }

        /// <summary>
        /// Ürüne yeni çeviri ekler. Unique slug verisi oluşturur. (Admin)
        /// </summary>
        /// <param name="id"></param>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("{id}/translations")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ApiResponse<Unit>>> AddTranslation(Guid id, [FromBody] AddProductTranslationCommand command)
        {
            if (id != command.ProductId)
                return BadRequest(ApiResponse<Unit>.Fail(Messages.IdMismatch));

            await _mediator.Send(command);
            return Ok(ApiResponse<Unit>.Success(Unit.Value));
        }
    }
}