using Microsoft.EntityFrameworkCore;
using Services.Product.Domain.Entities;

namespace Services.Product.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<ProductEntity> Products { get; set; }
        public DbSet<CategoryEntity> Categories { get; set; }
        public DbSet<ProductTranslationEntity> ProductTranslations { get; set; }
        public DbSet<CategoryTranslationEntity> CategoryTranslations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /* ==================== PRODUCT ==================== */

            modelBuilder.Entity<ProductEntity>(entity =>
            {
                entity.HasKey(p => p.Id);

                // Bire Çok
                entity.HasMany(p => p.Translations)
                      .WithOne(t => t.Product)
                      .HasForeignKey(t => t.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Sadece bir kategoriye sahip olabilir (Product -> Category)
                entity.HasOne(p => p.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(p => p.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Performans için index
                entity.HasIndex(p => p.CreatedDate);
            });

            modelBuilder.Entity<ProductTranslationEntity>(entity =>
            {
                entity.HasKey(t => t.Id);

                // Dil kodu maks 10 karakter
                entity.Property(t => t.LanguageCode)
                      .IsRequired()
                      .HasMaxLength(10);

                // İsim maks 200 karakter
                entity.Property(t => t.Name)
                      .IsRequired()
                      .HasMaxLength(200);

                // Açıklama maks 2000 karakter
                entity.Property(t => t.Description)
                      .HasMaxLength(2000);

                // Slug maks 250 karakter
                entity.Property(t => t.Slug)
                      .IsRequired()
                      .HasMaxLength(250);

                // Slug uniqueness (SEO)
                entity.HasIndex(t => new { t.Slug, t.LanguageCode })
                      .IsUnique();

                // Aynı ürüne aynı dilde 1 çeviri
                entity.HasIndex(t => new { t.ProductId, t.LanguageCode })
                      .IsUnique();
            });

            /* ==================== CATEGORY ==================== */

            modelBuilder.Entity<CategoryEntity>(entity =>
            {
                entity.HasKey(c => c.Id);

                // Bire Çok
                entity.HasMany(c => c.Translations)
                      .WithOne(t => t.Category)
                      .HasForeignKey(t => t.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Performans için index
                entity.HasIndex(c => c.CreatedDate);
            });

            modelBuilder.Entity<CategoryTranslationEntity>(entity =>
            {
                entity.HasKey(t => t.Id);

                // Dil kodu maks 10 karakter
                entity.Property(t => t.LanguageCode)
                      .IsRequired()
                      .HasMaxLength(10);

                // İsim maks 200 karakter
                entity.Property(t => t.Name)
                      .IsRequired()
                      .HasMaxLength(200);

                // Slug maks 250 karakter
                entity.Property(t => t.Slug)
                      .IsRequired()
                      .HasMaxLength(250);

                // Slug uniqueness (SEO)
                entity.HasIndex(t => new { t.Slug, t.LanguageCode })
                      .IsUnique();

                // Aynı kategoriye aynı dilde 1 çeviri
                entity.HasIndex(t => new { t.CategoryId, t.LanguageCode })
                      .IsUnique();
            });
        }
    }
}
