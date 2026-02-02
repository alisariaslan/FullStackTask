///Gateways.Yarp.Program.cs

// Bu gateway, frontend'in backend servislerle
// doğrudan değil merkezi bir giriş noktası üzerinden
// konuşmasını sağlamak için eklenmiştir.

using Microsoft.AspNetCore.RateLimiting;
using Serilog;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// HealthChecks
// Task: Production-readiness & container orchestration
// Docker Compose + depends_on senaryoları için gereklidir
builder.Services.AddHealthChecks();

// Serilog
// Task: Global logging & observability beklentisi
// Merkezi loglama (Seq) altyapısına hazır
builder.Host.UseSerilog((context, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration));

// Reverse Proxy (YARP)
// Task: API Gateway üzerinden servis yönlendirme
// Frontend yalnızca Gateway'i bilir, servisler gizlidir
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// CORS
// Task: Frontend (Next.js) → Backend iletişimi
// CORS politikası gateway seviyesinde merkezi olarak yönetilir
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
          // Task scope gereği origin whitelist yerine
          // development-friendly yapı tercih edilmiştir
          .SetIsOriginAllowed(origin => true)
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
    });
});

// Rate Limiter
// Task: API Gateway sorumlulukları
// Basic abuse protection & throttling örneği
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", policy =>
    {
        policy.PermitLimit = 100;
        policy.Window = TimeSpan.FromMinutes(1);
        policy.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        policy.QueueLimit = 5;
    });
});

var app = builder.Build();

// Health endpoint
// Docker, CI ve local ortamlar için readiness check
app.MapHealthChecks("/health");

// HTTPS redirection
// Production ortamda gateway arkasında termination varsayılmıştır
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

// Centralized CORS
app.UseCors("AllowFrontend");

// Gateway-level rate limiting
app.UseRateLimiter();

// Reverse proxy entry point
// Tüm backend servislerine giden trafik buradan geçer
app.MapReverseProxy();

app.Run();