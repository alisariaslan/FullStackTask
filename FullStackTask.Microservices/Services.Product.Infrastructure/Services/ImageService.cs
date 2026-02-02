using Microsoft.AspNetCore.Hosting;
using Services.Product.Application.Interfaces;
using Shared.Kernel.Constants;

namespace Services.Product.Infrastructure.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;

        public ImageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveImageAsync(Stream fileStream, string fileName, CancellationToken cancellationToken)
        {
            var extension = Path.GetExtension(fileName)?.ToLowerInvariant();
            if (extension != ".png")
                throw new InvalidOperationException(Messages.InvalidImage);

            // MIME type kontrolü eklenebilir

            string webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            string uploadsFolder = Path.Combine(webRootPath, "images", "products");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + fileName;
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var outputFileStream = new FileStream(filePath, FileMode.Create))
            {
                await fileStream.CopyToAsync(outputFileStream, cancellationToken);
            }

            return $"/images/products/{uniqueFileName}";
        }
    }
}
