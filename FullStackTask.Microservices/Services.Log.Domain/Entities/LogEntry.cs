namespace Services.Log.Domain.Entities
{
    public class LogEntry
    {
        public required string ServiceName { get; set; }
        public required string Message { get; set; }
        public required string Level { get; set; } 
        public string? StackTrace { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
