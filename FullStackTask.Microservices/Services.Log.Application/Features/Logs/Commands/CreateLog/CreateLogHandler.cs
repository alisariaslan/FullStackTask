using MediatR;
using Microsoft.Extensions.Logging;

namespace Services.Log.Application.Features.Logs.Commands.CreateLog
{
    public class CreateLogHandler : IRequestHandler<CreateLogCommand, bool>
    {
        private readonly ILogger<CreateLogHandler> _logger;

        public CreateLogHandler(ILogger<CreateLogHandler> logger)
        {
            _logger = logger;
        }

        public Task<bool> Handle(CreateLogCommand request, CancellationToken cancellationToken)
        {
            // Gelen isteği yapısal olarak Seq'e kaydediyoruz
            _logger.LogInformation(
                "[LOG-API] Source: {ServiceName} | Level: {Level} | Msg: {Message} | Stack: {StackTrace}",
                request.ServiceName,
                request.Level,
                request.Message,
                request.StackTrace ?? "N/A"
            );

            return Task.FromResult(true);
        }
    }
}
