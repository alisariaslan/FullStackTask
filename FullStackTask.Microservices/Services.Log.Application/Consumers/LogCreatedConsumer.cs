using MassTransit;
using MediatR;
using Services.Log.Application.Features.Logs.Commands.CreateLog;
using Shared.Kernel.IntegrationEvents;

namespace Services.Log.Application.Consumers
{
    /// <summary>
    /// Loglar için consumer sınıfı
    /// </summary>
    public class LogCreatedConsumer : IConsumer<LogCreatedEvent>
    {
        private readonly IMediator _mediator;

        public LogCreatedConsumer(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task Consume(ConsumeContext<LogCreatedEvent> context)
        {
            var command = new CreateLogCommand
            {
                ServiceName = context.Message.ServiceName,
                Message = context.Message.Message,
                Level = context.Message.Level,
                Timestamp = context.Message.Timestamp
            };

            await _mediator.Send(command);
        }
    }
}
