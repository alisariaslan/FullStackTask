///Services.Log.API.Program.cs

// Bu servis, diğer mikroservislerden gelen
// event'leri (async) dinleyerek merkezi loglama yapar.
// Servisler arası loose-coupling hedeflenmiştir.

using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;
using Services.Log.Application.Consumers;
using Shared.Kernel.Behaviors;
using Shared.Kernel.Middlewares;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// HealthChecks
// Task: Container orchestration & service readiness
builder.Services.AddHealthChecks();

// Serilog
// Task: Structured logging & centralized observability
builder.Host.UseSerilog((context, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration));

// JWT Authentication
// Task: Mikroservisler arası güvenli iletişim
// Log servisi de yetkilendirilmiş istekleri kabul eder
var jwtSection = builder.Configuration.GetSection("JwtSettings")!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!)),
            ValidateIssuer = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSection["Audience"],
            ClockSkew = TimeSpan.Zero
        };
    });

// Endpoints & Swagger
// Task: API discoverability & debugging
// Log servisleri genelde internal olsa da
// task kapsamında görünür bırakılmıştır
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Bearer {token}",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Controllers & JSON Options
// Task: Consistent API contract (camelCase JSON)
builder.Services.AddControllers()
    .AddJsonOptions(opt => opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

// HttpContextAccessor
// Task: CorrelationId, UserContext, enrichment için
builder.Services.AddHttpContextAccessor();

// MediatR
// Task: CQRS altyapısı & cross-cutting behavior’lar
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Services.Log.Application.Features.Logs.Commands.CreateLog.CreateLogCommand).Assembly);
    cfg.AddOpenBehavior(typeof(LocalizationBehavior<,>));
});

// MassTransit (RabbitMQ)
// Task: Event-driven communication
// Product/Auth servislerinden gelen event’ler
// async olarak tüketilir
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<LogCreatedConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        var rabbitSection = builder.Configuration.GetSection("RabbitMQSettings")!;
        cfg.Host(rabbitSection["Host"]!, "/", h =>
        {
            h.Username(rabbitSection["Username"]!);
            h.Password(rabbitSection["Password"]!);
        });
        // Task: Resilience & retry strategy
        cfg.UseMessageRetry(r => r.Interval(5, TimeSpan.FromSeconds(10)));
        // Task: Dedicated queue for log service
        cfg.ReceiveEndpoint("log-service-queue", e =>
        {
            e.ConfigureConsumer<LogCreatedConsumer>(context);
        });
    });
});

var app = builder.Build();

// Health endpoint
app.MapHealthChecks("/health");

// Serilog request logging
// Task: HTTP visibility (ops/debug)
app.UseSerilogRequestLogging();

// Global exception handling
// Task: Consistent error response & logging
app.UseMiddleware<ExceptionMiddleware>();

// Swagger (Development only)
// Task: Security & environment separation
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers();

app.Run();