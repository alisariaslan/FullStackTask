using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Product.Application.Features.Categories.Commands.AddCategoryTranslation;
using Services.Product.Application.Features.Categories.Commands.CreateCategory;
using Services.Product.Application.Features.Categories.Queries.GetAllCategories;
using Services.Product.Application.Models;
using Shared.Kernel.Constants;
using Shared.Kernel.Models;

namespace Services.Product.API.Controllers
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

        [HttpPost("{id}/translations")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Unit>>> AddTranslation(Guid id, [FromBody] AddCategoryTranslationCommand command)
        {
            if (id != command.CategoryId)
                return BadRequest(ApiResponse<Unit>.Fail(Messages.IdMismatch));

            await _mediator.Send(command);
            return Ok(ApiResponse<Unit>.Success(Unit.Value));
        }
    }
}