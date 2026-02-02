using MediatR;

namespace Services.Log.Application.Features.Logs.Commands.CreateLog
{
    public class CreateLogCommand : IRequest<bool>
    {
        public required string ServiceName { get; set; }
        public required string Message { get; set; }
        public required string Level { get; set; }
        public string? StackTrace { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
