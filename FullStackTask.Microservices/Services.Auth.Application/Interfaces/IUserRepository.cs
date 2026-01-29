using Services.Auth.Domain.Entities;

namespace Services.Auth.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<UserEntity?> GetByUsernameAsync(string username);
        Task<bool> UserExistsAsync(string username);
        Task AddAsync(UserEntity user);
    }
}
