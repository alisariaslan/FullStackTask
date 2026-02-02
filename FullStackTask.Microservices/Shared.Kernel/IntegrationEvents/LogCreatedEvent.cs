namespace Shared.Kernel.IntegrationEvents
{
    /// <summary>
    /// Log oluşturuldu bildirim eventi
    /// </summary>
    public class LogCreatedEvent
    {
        public required string Level { get; set; } = "Info";
        public required string Message { get; set; }
        public required string ServiceName { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
