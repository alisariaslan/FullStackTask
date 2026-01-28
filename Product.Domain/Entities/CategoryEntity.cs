namespace Product.Domain.Entities
{
    public class CategoryEntity
    {
        public Guid Id { get; set; }
        public ICollection<CategoryTranslationEntity> Translations { get; set; } = new List<CategoryTranslationEntity>();
        public ICollection<ProductEntity>? Products { get; set; }
    }
}
