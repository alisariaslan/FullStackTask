namespace Services.Product.API.Entities
{
    public class CategoryTranslationEntity
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public CategoryEntity? Category { get; set; }
        public string LanguageCode { get; set; } = "en";
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
    }
}
