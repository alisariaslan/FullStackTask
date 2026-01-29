using MediatR;
using Microsoft.AspNetCore.Http;
using Shared.Kernel.Interfaces;

namespace Shared.Kernel.Behaviors
{
    public class LocalizationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
         where TRequest : IRequest<TResponse>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocalizationBehavior(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            if (request is ILocalizedRequest localizedRequest)
            {
                var httpContext = _httpContextAccessor.HttpContext;
                if (httpContext != null)
                {
                    var lang = httpContext.Request.Headers["Accept-Language"].ToString().Split(',').FirstOrDefault()?.Trim();

                    if (!string.IsNullOrEmpty(lang))
                    {
                        localizedRequest.LanguageCode = lang;
                    }
                }
            }

            return await next();
        }
    }
}
