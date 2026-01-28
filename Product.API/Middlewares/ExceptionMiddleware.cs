using Product.API.Models;
using Product.Application.Exceptions;
using System.Net;

namespace Product.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                if (ex is ValidationException)
                    _logger.LogWarning("İş kuralı hatası: {Message}", ex.Message);
                else
                    _logger.LogError(ex, "Sistem Hatası: {Message}", ex.Message);

                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            string message;
            var errors = new List<string>();

            switch (exception)
            {
                case ValidationException validationEx:
                    context.Response.StatusCode = (int)HttpStatusCode.OK;
                    message = validationEx.Message;
                    errors.Add(validationEx.Message);
                    break;

                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    if (_env.IsDevelopment())
                    {
                        message = exception.Message;
                        errors.Add(exception.StackTrace ?? "");
                    }
                    else
                    {
                        message = "Sunucu tarafında beklenmeyen bir hata oluştu.";
                        errors.Add(message);
                    }
                    break;
            }

            var response = ApiResponse<object>.Fail(message, errors);

            await context.Response.WriteAsync(response.ToString());
        }
    }
}