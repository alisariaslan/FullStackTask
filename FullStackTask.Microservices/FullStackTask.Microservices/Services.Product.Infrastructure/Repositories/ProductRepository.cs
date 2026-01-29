using Microsoft.EntityFrameworkCore;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Services.Product.Infrastructure.Data;

namespace Services.Product.Infrastructure.Repositories
{
  

    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductEntity>> GetAllAsync()
        {
            return await _context.Products
            .Include(p => p.Translations)
            .Include(p => p.Category)
                .ThenInclude(c => c!.Translations)
            .ToListAsync();
        }

        public async Task AddAsync(ProductEntity product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task<ProductEntity?> GetByIdAsync(Guid id)
        {
            return await _context.Products
           .Include(p => p.Translations)
           .Include(p => p.Category)
               .ThenInclude(c => c!.Translations)
           .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}