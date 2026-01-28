using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Product.API.Models;
using Product.Application.Constants;
using Product.Application.DTOs;
using Product.Application.Features.Products.Commands.CreateProduct;
using Product.Application.Features.Products.Queries.GetAllProducts;
using Product.Application.Features.Products.Queries.GetProductById;

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
    }
}