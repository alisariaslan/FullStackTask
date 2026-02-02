using MediatR;
using Services.Auth.Application.Interfaces;
using Services.Auth.Application.Models;

namespace Services.Auth.Application.Features.Auth.Commands.Login
{
    /// <summary>
    /// Kullanıcı girişini sağlar
    /// </summary>
    public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
    {
        private readonly IAuthService _authService;

        public LoginCommandHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            return await _authService.LoginAsync(request.LoginDto);
        }
    }
}
