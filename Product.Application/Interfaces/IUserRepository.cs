using Product.Domain.Entities;

namespace Product.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<UserEntity?> GetByUsernameAsync(string username);
        Task<bool> UserExistsAsync(string username);
        Task AddAsync(UserEntity user);
    }
}
