namespace Services.Product.Application.Interfaces
{
    public interface ICategorySlugService
    {
        /// <summary>
        /// Kategori için uniq slug üretir
        /// </summary>
        /// <param name="text"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        Task<string> GenerateUniqueSlugAsync(string text, string languageCode);
    }

}
