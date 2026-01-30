
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Services.Log.Application.Features.Logs.Commands.CreateLog;

namespace Services.Log.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public LogsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateLog([FromBody] CreateLogCommand command)
        {
            command.Timestamp = DateTime.UtcNow;
            await _mediator.Send(command);
            return Ok();
        }
    }
}
