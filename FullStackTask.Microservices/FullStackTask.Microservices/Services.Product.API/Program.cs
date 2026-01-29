/// Services.Product.API.Program.cs

using MassTransit;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Services.Product.Application.Interfaces;
using Services.Product.Infrastructure.Data;
using Services.Product.Infrastructure.Repositories;
using Services.Product.Infrastructure.Services;
using Shared.Kernel.Behaviors;
using Shared.Kernel.Extensions;
using Shared.Kernel.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// --- SHARED KERNEL  -----------------------------------------

// Serilog
builder.AddSharedSerilog("ProductService");

// Swagger
builder.Services.AddSharedSwagger();

// Auth
builder.Services.AddSharedAuthentication(builder.Configuration);

// CORS
builder.Services.AddSharedCors(builder.Configuration, "AllowNextApp");

// ------------------------------------------------------------

// Property Naming Policy
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("Services.Product.API")));

// Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
    options.InstanceName = "ProductStore_";
});

// HttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Services
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// MediatR
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddOpenBehavior(typeof(LocalizationBehavior<,>));
});

// MassTransit (RabbitMQ)
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h => {
            h.Username("guest");
            h.Password("guest");
        });
    });
});

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseMiddleware<ExceptionMiddleware>();

// Migration
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Product DB Migration Error");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowNextApp");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();