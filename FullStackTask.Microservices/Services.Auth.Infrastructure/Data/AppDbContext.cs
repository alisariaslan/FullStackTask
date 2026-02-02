
using Microsoft.EntityFrameworkCore;
using Services.Auth.Domain.Entities;

namespace Services.Auth.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserEntity> Users { get; set; }
    }
}