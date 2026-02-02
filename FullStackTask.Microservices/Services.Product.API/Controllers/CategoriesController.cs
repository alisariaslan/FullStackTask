using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Product.Application.Features.Categories.Commands.AddCategoryTranslation;
using Services.Product.Application.Features.Categories.Commands.CreateCategory;
using Services.Product.Application.Features.Categories.Queries.GetAllCategories;
using Services.Product.Application.Features.Categories.Queries.GetCategoryBySlug;
using Services.Product.Application.Models;
using Shared.Kernel.Constants;
using Shared.Kernel.Models;

namespace Services.Product.API.Controllers
{
    /// <summary>
    /// Kategorilerini yöneten kontrolcü sınıfı
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CategoriesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Tüm kategorileri getirir
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetAll()
        {
            var result = await _mediator.Send(new GetAllCategoriesQuery());
            return Ok(ApiResponse<List<CategoryDto>>.Success(result));
        }

        /// <summary>
        /// Yeni kategori üretir. Unique slug verisi oluşturur. (Admin)
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ApiResponse<Guid>>> Create(CreateCategoryCommand command)
        {
            var id = await _mediator.Send(command);
            return Ok(ApiResponse<Guid>.Success(id));
        }

        /// <summary>
        /// Kategoriyi slug verisine göre getirir
        /// </summary>
        /// <param name="slug"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        [HttpGet("by-slug/{slug}")]
        public async Task<ActionResult<ApiResponse<CategoryDto>>> GetBySlug(string slug, [FromQuery] string languageCode = "en")
        {
            var result = await _mediator.Send(
                new GetCategoryBySlugQuery(slug, languageCode)
            );

            if (result == null)
                return NotFound(ApiResponse<CategoryDto>.Fail(Messages.ProductNotFound));

            return Ok(ApiResponse<CategoryDto>.Success(result));
        }

        /// <summary>
        /// Kategoriye çeviri ekler.  Unique slug verisi oluşturur.  (Admin)
        /// </summary>
        /// <param name="id"></param>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("{id}/translations")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ApiResponse<Unit>>> AddTranslation(Guid id, [FromBody] AddCategoryTranslationCommand command)
        {
            if (id != command.CategoryId)
                return BadRequest(ApiResponse<Unit>.Fail(Messages.IdMismatch));

            await _mediator.Send(command);
            return Ok(ApiResponse<Unit>.Success(Unit.Value));
        }
    }
}