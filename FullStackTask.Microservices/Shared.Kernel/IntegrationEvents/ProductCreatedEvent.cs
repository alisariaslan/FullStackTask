namespace Shared.Kernel.IntegrationEvents
{
    /// <summary>
    /// Ürün oluşturuldu bildirim eventi
    /// </summary>
    public class ProductCreatedEvent
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public Guid CategoryId { get; set; }
    }
}
