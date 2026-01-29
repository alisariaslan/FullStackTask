namespace Services.Product.Domain.Entities
{
    public class ProductTranslationEntity
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public ProductEntity? Product { get; set; }
        public string LanguageCode { get; set; } = "en"; 
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty; 
    }
}
