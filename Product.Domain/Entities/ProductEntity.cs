namespace Product.Domain.Entities
{
    public class ProductEntity
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}