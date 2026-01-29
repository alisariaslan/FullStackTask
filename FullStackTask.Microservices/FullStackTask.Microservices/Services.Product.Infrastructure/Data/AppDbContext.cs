
using Microsoft.EntityFrameworkCore;
using Services.Product.Domain.Entities;

namespace Services.Product.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ProductEntity> Products { get; set; }
        public DbSet<CategoryEntity> Categories { get; set; }
        public DbSet<ProductTranslationEntity> ProductTranslations { get; set; }
        public DbSet<CategoryTranslationEntity> CategoryTranslations { get; set; }
    }
}