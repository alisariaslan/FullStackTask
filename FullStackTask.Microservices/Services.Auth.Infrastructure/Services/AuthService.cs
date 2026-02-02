using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Services.Auth.Application.Interfaces;
using Services.Auth.Application.Models;
using Services.Auth.Domain.Entities;
using Shared.Kernel.Constants;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Services.Auth.Infrastructure.Services
{

    /// <summary>
    /// Kullanıcı yetki işlemlerini gerçekleştirir
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        /// <summary>
        /// Kullanıcı kaydını yapar
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="ValidationException"></exception>
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto request)
        {
            if (await _userRepository.UserExistsByEmailAsync(request.Email))
                throw new ValidationException(Messages.UserEmailAlreadyExists);

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new UserEntity
            {
                Username = request.Email,
                PasswordHash = Convert.ToBase64String(passwordHash) + "." + Convert.ToBase64String(passwordSalt),
                Role = Roles.User
            };

            await _userRepository.AddAsync(user);

            return new AuthResponseDto(CreateToken(user), user.Username);
        }

        /// <summary>
        /// Kullanıcı girişini sağlar
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="ValidationException"></exception>
        public async Task<AuthResponseDto> LoginAsync(LoginDto request)
        {
            var user = await _userRepository.GetUserByEmail(request.Email);

            if (user == null)
                throw new ValidationException(Messages.UserNotFound);

            var parts = user.PasswordHash.Split('.');
            var storedHash = Convert.FromBase64String(parts[0]);
            var storedSalt = Convert.FromBase64String(parts[1]);

            if (!VerifyPasswordHash(request.Password, storedHash, storedSalt))
            {
                throw new ValidationException(Messages.PasswordIncorrect);
            }

            return new AuthResponseDto(CreateToken(user), user.Username);
        }

        /// <summary>
        /// Kullanıcıya özel token üretir
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        private string CreateToken(UserEntity user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role ??Roles.User)
            };

            var jwtSettings = _configuration.GetSection("JwtSettings")!;
            var jwtKey = jwtSettings["Key"]!;
            var issuer = jwtSettings["Issuer"]!;
            var audience = jwtSettings["Audience"]!;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(storedHash);
            }
        }
    }
}