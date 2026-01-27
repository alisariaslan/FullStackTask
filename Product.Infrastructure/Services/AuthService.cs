using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Product.Application.DTOs;
using Product.Application.Interfaces;
using Product.Domain.Entities;
using Product.Infrastructure.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Product.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                throw new Exception("Bu e-posta adresi zaten kullanılıyor.");
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new UserEntity
            {
                Username = request.Username,
                PasswordHash = Convert.ToBase64String(passwordHash) + "." + Convert.ToBase64String(passwordSalt)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new AuthResponseDto(CreateToken(user), user.Username);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null) throw new Exception("Kullanıcı bulunamadı.");

            var parts = user.PasswordHash.Split('.');
            var storedHash = Convert.FromBase64String(parts[0]);
            var storedSalt = Convert.FromBase64String(parts[1]);

            if (!VerifyPasswordHash(request.Password, storedHash, storedSalt))
            {
                throw new Exception("Şifre yanlış.");
            }

            return new AuthResponseDto(CreateToken(user), user.Username);
        }

        private string CreateToken(UserEntity user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
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