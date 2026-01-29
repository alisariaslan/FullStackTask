using Microsoft.EntityFrameworkCore;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Services.Product.Infrastructure.Data;

namespace Services.Product.Infrastructure.Repositories
{
 
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoryEntity>> GetAllAsync()
        {
            return await _context.Categories
                .Include(c => c.Translations)
                .ToListAsync();
        }

        public async Task AddAsync(CategoryEntity category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
        }

        public async Task<CategoryEntity?> GetByIdAsync(Guid id)
        {
            return await _context.Categories
                .Include(c => c.Translations)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> SlugExistsAsync(string slug)
        {
            return await _context.Categories
                .AnyAsync(c => c.Translations.Any(t => t.Slug == slug));
        }

        public async Task UpdateAsync(CategoryEntity category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }
    }
}
