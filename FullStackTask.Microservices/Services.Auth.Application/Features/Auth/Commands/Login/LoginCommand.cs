using MediatR;
using Services.Auth.Application.Interfaces;
using Services.Auth.Application.Models;

namespace Services.Auth.Application.Features.Auth.Commands.Login
{
    public class LoginCommand : IRequest<AuthResponseDto>
    {
        public LoginDto LoginDto { get; set; }

        public LoginCommand(LoginDto loginDto)
        {
            LoginDto = loginDto;
        }
    }

   
}
