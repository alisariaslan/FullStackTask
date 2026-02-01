///Services.Product.API.Program.cs

// Phase 2 & Phase 3 – Product Service
// Bu servis, ürün CRUD işlemlerinin ana sorumlusudur.
// CQRS, Redis Cache ve Event Publishing altyapısı içerir.

using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;
using Services.Product.Application.Interfaces;
using Services.Product.Infrastructure.Data;
using Services.Product.Infrastructure.Repositories;
using Services.Product.Infrastructure.Services;
using Shared.Kernel.Behaviors;
using Shared.Kernel.Middlewares;
using StackExchange.Redis;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// HealthChecks
// Task: Container readiness & service health
builder.Services.AddHealthChecks();

// Serilog
// Task: Structured logging & centralized observability
builder.Host.UseSerilog((context, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration));

// JWT Authentication
// Task: Protected product operations
// Create / Update / Delete işlemleri JWT gerektirir
var jwtSection = builder.Configuration.GetSection("JwtSettings");
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
// Task: API documentation & JWT secured endpoints visibility
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
// Task: Consistent API response contract
builder.Services.AddControllers().AddJsonOptions(opt => opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

// Database (PostgreSQL)
// Task: EF Core + relational database usage
var connStrSection = builder.Configuration.GetSection("ConnectionStrings")!;
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(connStrSection["PostgreConnection"]!));

// Redis Cache
// Task: Query side optimization
// Product listing & detail queries cache’lenir
builder.Services.AddStackExchangeRedisCache(opt =>
{
    opt.Configuration = connStrSection["Redis"]!;
});

// Cache Invalidation 
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(connStrSection["Redis"]!));

// HttpContextAccessor
// Task: User context, audit & localization
builder.Services.AddHttpContextAccessor();

// Services & Repositories
// Task: SOLID & clean separation (Infrastructure ↔ Application
builder.Services.AddScoped<ICategorySlugService, CategorySlugService>();
builder.Services.AddScoped<IProductSlugService, ProductSlugService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// MediatR
// Task: CQRS (Command / Query separation)
// LocalizationBehavior örnek cross-cutting concern
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Services.Product.Application.Features.Products.Commands.CreateProduct.CreateProductCommand).Assembly);
    cfg.AddOpenBehavior(typeof(LocalizationBehavior<,>));
});

// MassTransit (RabbitMQ)
// Task: Event publishing (ProductCreated, ProductUpdated, etc.)
// Log Service gibi downstream servisler bilgilendirilir
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((context, cfg) =>
    {
        var rabbitSection = builder.Configuration.GetSection("RabbitMQSettings")!;
        cfg.Host(rabbitSection["Host"]!, "/", h =>
        {
            h.Username(rabbitSection["Username"]!);
            h.Password(rabbitSection["Password"]!);
        });
        cfg.UseMessageRetry(r => r.Interval(5, TimeSpan.FromSeconds(10)));
    });
});

var app = builder.Build();

// Health endpoint
app.MapHealthChecks("/health");

// Serilog request logging
// Task: HTTP request tracing
app.UseSerilogRequestLogging();

// Global exception handling
// Task: Consistent error model & logging
app.UseMiddleware<ExceptionMiddleware>();

// Database migration
// Task: Development & demo simplicity
// Production’da CI/CD aşamasına taşınır
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (app.Environment.IsDevelopment())
        db.Database.Migrate();
    else
        db.Database.EnsureCreated();
}

// Swagger (Development only)
// Task: Security & environment separation
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }

// Static files
// Task: Product image serving (local / demo scope)
app.UseStaticFiles();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers();

app.Run();