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

// CORS Politikası
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Frontend
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Auto migrate
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    int retryCount = 0;
    while (retryCount < 5)
    {
        try
        {
            Console.WriteLine("Veritabanına bağlanılıyor ve migration uygulanıyor...");
            context.Database.Migrate();
            Console.WriteLine("Veritabanı migration işlemi başarıyla tamamlandı.");
            break;
        }
        catch (Exception ex)
        {
            retryCount++;
            Console.WriteLine($"Veritabanı hatası (Deneme {retryCount}/5): {ex.Message}");
            System.Threading.Thread.Sleep(2000);
        }
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