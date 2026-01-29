///Services.Product.API.Program.cs

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
using Shared.Kernel.Constants;
using Shared.Kernel.Middlewares;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();

// Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "ProductService")
        .WriteTo.Console()
        .WriteTo.File("logs/ProductService-log-.txt", rollingInterval: RollingInterval.Day));

// JWT
var jwtSection = builder.Configuration.GetSection(ConfigurationKeys.JwtSettings);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection[ConfigurationKeys.JwtKey]!)),
            ValidateIssuer = true,
            ValidIssuer = jwtSection[ConfigurationKeys.JwtIssuer],
            ValidateAudience = true,
            ValidAudience = jwtSection[ConfigurationKeys.JwtAudience],
            ClockSkew = TimeSpan.Zero
        };
    });

// EndpointsApiExplorer
builder.Services.AddEndpointsApiExplorer();

// Swagger
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

// Json Naming Policy
builder.Services.AddControllers().AddJsonOptions(opt => opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

// Postgre
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseNpgsql(builder.Configuration[ConfigurationKeys.PostgreConnection]));

// Redis
builder.Services.AddStackExchangeRedisCache(opt =>
{
    opt.Configuration = builder.Configuration[ConfigurationKeys.RedisConnection];
});

// AddHttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Services
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// MediatR
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Services.Product.Application.Features.Products.Commands.CreateProduct.CreateProductCommand).Assembly);
    cfg.AddOpenBehavior(typeof(LocalizationBehavior<,>));
});

// MassTransit
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((context, cfg) =>
    {
        var rabbitSection = builder.Configuration.GetSection(ConfigurationKeys.RabbitMQSection);
        cfg.Host(rabbitSection["Host"] ?? "localhost", "/", h =>
        {
            h.Username(rabbitSection["Username"] ?? "guest");
            h.Password(rabbitSection["Password"] ?? "guest");
        });
    });
});

var app = builder.Build();

app.MapHealthChecks("/health");

// Serilog
app.UseSerilogRequestLogging();

// Middleware 
app.UseMiddleware<ExceptionMiddleware>();

// DB Migration
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();