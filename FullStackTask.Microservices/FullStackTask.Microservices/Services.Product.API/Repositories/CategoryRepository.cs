using Microsoft.EntityFrameworkCore;
using Services.Product.API.Data;
using Services.Product.API.Entities;

namespace Services.Product.API.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<CategoryEntity>> GetAllAsync();
        Task AddAsync(CategoryEntity category);
        Task<CategoryEntity?> GetByIdAsync(Guid id);

    }
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
    }
}
