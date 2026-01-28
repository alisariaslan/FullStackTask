using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Product.Application.Interfaces;

namespace Product.Infrastructure.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;

        public ImageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveImageAsync(IFormFile? file, CancellationToken cancellationToken)
        {
            if (file == null)
                return "/images/no-image.png";

            string webRootPath = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");

            string uploadsFolder = Path.Combine(webRootPath, "images/products");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream, cancellationToken);
            }

            return $"/images/products/{uniqueFileName}";
        }
    }
}
