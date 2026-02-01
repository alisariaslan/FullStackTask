namespace Services.Product.Application.Interfaces
{
    public interface IImageService
    {
        /// <summary>
        /// Klasör yoluna resmi kayıt eder
        /// </summary>
        /// <param name="fileStream"></param>
        /// <param name="fileName"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<string> SaveImageAsync(Stream fileStream, string fileName, CancellationToken cancellationToken);
    }
}
