using Microsoft.AspNetCore.Http;

namespace Product.Application.Interfaces
{
    public interface IImageService
    {
        Task<string> SaveImageAsync(IFormFile? file, CancellationToken cancellationToken);
    }
}
