using MediatR;
using Microsoft.AspNetCore.Mvc;
using Product.API.Models;
using Product.Application.DTOs;
using Product.Application.Features.Auth.Commands.Login;
using Product.Application.Features.Auth.Commands.Register;

namespace Product.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto request)
        {
            var result = await _mediator.Send(new RegisterCommand(request));
            return Ok(ApiResponse<AuthResponseDto>.Success(result, "Kayıt başarılı"));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto request)
        {
            var result = await _mediator.Send(new LoginCommand(request));
            return Ok(ApiResponse<AuthResponseDto>.Success(result, "Giriş başarılı"));
        }
    }
}
