namespace Services.Product.Application.Interfaces
{
    public interface IImageService
    {
        Task<string> SaveImageAsync(Stream fileStream, string fileName, CancellationToken cancellationToken);
    }
}
