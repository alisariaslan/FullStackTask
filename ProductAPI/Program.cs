using Microsoft.EntityFrameworkCore;
using ProductAPI.Data;
using ProductAPI.Repositories;
using ProductAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Veritabanı (DI)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Servislerimiz (DI)
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

var app = builder.Build();

// HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // Swagger arayüzü
}

// CORS Politikası (local ihtiyaç halinde açılacak)
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowNextApp",
//        policy =>
//        {
//            policy.WithOrigins("http://localhost:3000") // Frontend adresi
//                  .AllowAnyHeader()
//                  .AllowAnyMethod();
//        });
//});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();