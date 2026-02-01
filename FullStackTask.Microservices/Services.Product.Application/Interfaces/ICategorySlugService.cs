namespace Services.Product.Application.Interfaces
{
    public interface ICategorySlugService
    {
        Task<string> GenerateUniqueSlugAsync(string text, string languageCode);
    }

}
