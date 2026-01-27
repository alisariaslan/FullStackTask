using Microsoft.EntityFrameworkCore;
using Product.Infrastructure.Data;
using Product.Infrastructure.Repositories;
using Product.Application.Interfaces;
using Product.Application.DTOs;

var builder = WebApplication.CreateBuilder(args);

// Controller
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Veritabanı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IProductRepository, ProductRepository>();

// MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ProductDto).Assembly));

// CORS Politikası (Frontend için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Migration
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        // Veritabanı yoksa oluşturur, varsa eksik migrationları uygular
        Console.WriteLine("Veritabanı migration kontrol ediliyor...");
        context.Database.Migrate();
        Console.WriteLine("Veritabanı hazır.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Veritabanı başlatılırken hata oluştu: {ex.Message}");
    }
}

// HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowNextApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();