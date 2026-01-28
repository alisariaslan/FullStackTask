using Microsoft.EntityFrameworkCore;
using Product.Application.Interfaces;
using Product.Infrastructure.Data;

namespace Product.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product.Domain.Entities.ProductEntity>> GetAllAsync()
        {
            return await _context.Products
            .Include(p => p.Translations)
            .Include(p => p.Category)
                .ThenInclude(c => c!.Translations)
            .ToListAsync();
        }

        public async Task AddAsync(Product.Domain.Entities.ProductEntity product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task<Product.Domain.Entities.ProductEntity?> GetByIdAsync(Guid id)
        {
            return await _context.Products
           .Include(p => p.Translations)
           .Include(p => p.Category)
               .ThenInclude(c => c!.Translations)
           .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}