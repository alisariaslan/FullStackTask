namespace Product.Domain.Entities
{
    public class ProductEntity
    {
        public Guid Id { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public Guid CategoryId { get; set; }
        public CategoryEntity? Category { get; set; }
        public ICollection<ProductTranslationEntity> Translations { get; set; } = new List<ProductTranslationEntity>();
    }
}