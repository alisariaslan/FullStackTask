using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.Options;
using Services.Auth.API.Constants;
using Services.Auth.API.Models;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;

namespace Services.Auth.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        private readonly JsonSerializerOptions _jsonOptions;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env, IOptions<JsonOptions> jsonOptions)
        {
            _next = next;
            _logger = logger;
            _env = env;
            _jsonOptions = jsonOptions.Value.SerializerOptions;
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
                    _logger.LogWarning("Business Error: {Message}", ex.Message);
                else
                    _logger.LogError(ex, "System Error: {Message}", ex.Message);

                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            string errorKey;
            var errors = new List<string>();
            int statusCode = (int)HttpStatusCode.InternalServerError;

            switch (exception)
            {
                case ValidationException validationEx:
                    statusCode = (int)HttpStatusCode.OK;
                    errorKey = validationEx.Message;
                    errors.Add(errorKey);
                    break;
                default:
                    statusCode = (int)HttpStatusCode.InternalServerError;
                    errorKey = Messages.SystemError;
                    if (_env.IsDevelopment())
                    {
                        errors.Add(exception.Message);
                    }
                    else
                    {
                        errors.Add("An unexpected error occurred at backend.");
                    }
                    _logger.LogError(exception, "System Error");
                    break;
            }
            context.Response.StatusCode = statusCode;
            var response = ApiResponse<object>.Fail(errorKey, errors);

            var json = JsonSerializer.Serialize(response, _jsonOptions);
            await context.Response.WriteAsync(json);
        }
    }
}