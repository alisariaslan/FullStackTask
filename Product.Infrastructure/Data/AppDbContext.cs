
using Microsoft.EntityFrameworkCore;

namespace Product.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product.Domain.Entities.Product> Products { get; set; }
    }
}