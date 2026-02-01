using Microsoft.EntityFrameworkCore;
using Services.Auth.Application.Interfaces;
using Services.Auth.Domain.Entities;
using Services.Auth.Infrastructure.Data;

namespace Services.Auth.Infrastructure.Repositories
{
  
    /// <summary>
    /// Kullanıcı veritabanı işlemlerini yapar
    /// </summary>
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Kullanıcıyı email ile getirir
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<UserEntity?> GetUserByEmail(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        /// <summary>
        /// Kullanıcı var mı diye email üzerinden kontrol yapar
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<bool> UserExistsByEmailAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        /// <summary>
        /// Yeni kullanıcı ekler
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task AddAsync(UserEntity user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
    }
}
