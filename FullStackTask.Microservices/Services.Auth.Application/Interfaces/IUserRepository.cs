using Services.Auth.Domain.Entities;

namespace Services.Auth.Application.Interfaces
{
    public interface IUserRepository
    {
        /// <summary>
        /// kullanıcıyı email adresinden getirir
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task<UserEntity?> GetUserByEmail(string email);
        /// <summary>
        /// Kullanıcı, email adresinden var mı diye kontrol edilir
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task<bool> UserExistsByEmailAsync(string email);
        /// <summary>
        /// Kullanıcı ekler
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        Task AddAsync(UserEntity user);
    }
}
