using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Product.Application.Features.Products.Commands.AddProductTranslation;
using Services.Product.Application.Features.Products.Commands.CreateProduct;
using Services.Product.Application.Features.Products.Queries.GetAllProducts;
using Services.Product.Application.Features.Products.Queries.GetProductById;
using Services.Product.Application.Models;
using Shared.Kernel.Constants;
using Shared.Kernel.Models;

namespace Services.Product.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetAll()
        {
            var result = await _mediator.Send(new GetAllProductsQuery());
            return Ok(ApiResponse<List<ProductDto>>.Success(result));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Guid>>> Create([FromForm] CreateProductCommand command)
        {
            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetAll), new { id = id }, ApiResponse<Guid>.Success(id));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetProductByIdQuery(id));
            if (result == null)
            {
                return NotFound(ApiResponse<ProductDto>.Fail(Messages.ProductNotFound));
            }
            return Ok(ApiResponse<ProductDto>.Success(result));
        }

        [HttpPost("{id}/translations")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Unit>>> AddTranslation(Guid id, [FromBody] AddProductTranslationCommand command)
        {
            if (id != command.ProductId)
                return Ok(ApiResponse<Unit>.Fail(Messages.IdMismatch));

            await _mediator.Send(command);
            return Ok(ApiResponse<Unit>.Success(Unit.Value));
        }
    }
}