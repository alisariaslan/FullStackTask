using Services.Auth.Application.Models;

namespace Services.Auth.Application.Interfaces
{
    public interface IAuthService
    {
        /// <summary>
        /// Kullanıcı kayıt
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<AuthResponseDto> RegisterAsync(RegisterDto request);
        /// <summary>
        /// Kullanıcı giriş
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<AuthResponseDto> LoginAsync(LoginDto request);
    }
}
