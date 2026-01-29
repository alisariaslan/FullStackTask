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


    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto request)
        {
            if (await _userRepository.UserExistsAsync(request.Username))
                throw new ValidationException(Messages.UserEmailAlreadyExists);

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new UserEntity
            {
                Username = request.Username,
                PasswordHash = Convert.ToBase64String(passwordHash) + "." + Convert.ToBase64String(passwordSalt),
                Role = Roles.User
            };

            await _userRepository.AddAsync(user);

            return new AuthResponseDto(CreateToken(user), user.Username);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto request)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);

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

        private string CreateToken(UserEntity user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role ??Roles.User)
            };

            var jwtKey = _configuration[$"{ConfigurationKeys.JwtSettings}:{ConfigurationKeys.JwtKey}"];
            var issuer = _configuration[$"{ConfigurationKeys.JwtSettings}:Issuer"];
            var audience = _configuration[$"{ConfigurationKeys.JwtSettings}:Audience"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new Exception("JWT Key configuration is missing!");
            }
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