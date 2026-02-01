namespace Services.Product.Domain.Entities
{
    public class CategoryEntity
    {
        public Guid Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public ICollection<CategoryTranslationEntity> Translations { get; set; } = new List<CategoryTranslationEntity>();

        public ICollection<ProductEntity> Products { get; set; }   = new List<ProductEntity>();
    }
}
