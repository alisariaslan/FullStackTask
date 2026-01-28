
using Microsoft.EntityFrameworkCore;
using Services.Auth.API.Entities;

namespace Services.Auth.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserEntity> Users { get; set; }
    }
}