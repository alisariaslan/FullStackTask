namespace Services.Product.Application.Interfaces
{
    public interface IProductSlugService
    {
        Task<string> GenerateUniqueSlugAsync(string text, string languageCode);
    }

}
