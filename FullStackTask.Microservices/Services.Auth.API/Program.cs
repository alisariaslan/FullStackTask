///Services.Auth.API.Program.cs

// Bu servis, kullanıcı kayıt / login işlemlerini yönetir
// ve JWT üretip doğrular.
// Diğer servisler (Product vs.) bu token’ı doğrular.

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;
using Services.Auth.Application.Interfaces;
using Services.Auth.Infrastructure.Data;
using Services.Auth.Infrastructure.Repositories;
using Services.Auth.Infrastructure.Services;
using Shared.Kernel.Behaviors;
using Shared.Kernel.Middlewares;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// HealthChecks
// Task: Container readiness & service health visibility
builder.Services.AddHealthChecks();

// Serilog
// Task: Centralized logging & production observability
builder.Host.UseSerilog((context, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration));

// JWT Authentication
// Task: Kimlik doğrulama (JWT) beklentisi
// Token validation: Issuer, Audience, SigningKey
// ClockSkew = 0 => production-benzeri strict validation
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

// EndpointsApiExplorer
// Task: Swagger & API discoverability
builder.Services.AddEndpointsApiExplorer();

// Swagger
// Task: API dokümantasyonu & test edilebilirlik
// JWT Bearer desteği eklenmiştir
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme (\"Bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Controllers & JSON Options
// Task: Clean API contract (camelCase JSON)
builder.Services.AddControllers().AddJsonOptions(opt => opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

// Database Configuration
// Task: PostgreSQL + EF Core kullanımı
var connStrSection = builder.Configuration.GetSection("ConnectionStrings")!;
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(connStrSection["PostgreConnection"]!));

// HttpContextAccessor
// Task: User context, localization, audit/log enrichment için
builder.Services.AddHttpContextAccessor();

// Services (DI)
// Task: SOLID (Dependency Inversion) & clean layering
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// MediatR
// Task: CQRS altyapısı (Command / Query separation)
// LocalizationBehavior örnek cross-cutting concern’dür
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Services.Auth.Application.Features.Auth.Commands.Login.LoginCommand).Assembly);
    cfg.AddOpenBehavior(typeof(LocalizationBehavior<,>));
});

var app = builder.Build();

// Health endpoint
// Docker, CI ve local ortamlar için readiness check
app.MapHealthChecks("/health");

// Serilog request logging
// Task: HTTP request visibility
app.UseSerilogRequestLogging();

// Global exception handling
// Task: Centralized error handling (production best practice)
app.UseMiddleware<ExceptionMiddleware>();

// Database Migration
// Task: Development & demo kolaylığı
// Production’da genellikle CI/CD aşamasına taşınır
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Swagger (Development only)
// Task: Güvenlik & environment separation
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers();

app.Run();