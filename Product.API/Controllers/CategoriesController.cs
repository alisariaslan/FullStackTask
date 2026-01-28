using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Product.API.Models;
using Product.Application.DTOs;
using Product.Application.Features.Categories.Commands.CreateCategory;
using Product.Application.Features.Categories.Queries.GetAllCategories;

namespace Product.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CategoriesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetAll()
        {
            var result = await _mediator.Send(new GetAllCategoriesQuery());
            return Ok(ApiResponse<List<CategoryDto>>.Success(result));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Guid>>> Create(CreateCategoryCommand command)
        {
            var id = await _mediator.Send(command);
            return Ok(ApiResponse<Guid>.Success(id));
        }
    }
}