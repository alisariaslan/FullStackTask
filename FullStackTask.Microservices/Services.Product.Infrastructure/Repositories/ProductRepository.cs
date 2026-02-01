using Microsoft.EntityFrameworkCore;
using Services.Product.Application.Interfaces;
using Services.Product.Domain.Entities;
using Services.Product.Infrastructure.Data;
using Shared.Kernel.Models;

namespace Services.Product.Infrastructure.Repositories
{
  

    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
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

        public async Task<bool> SlugExistsAsync(string slug, string languageCode)
        {
            return await _context.Products
                .AnyAsync(p =>
                    p.Translations.Any(t =>
                        t.Slug == slug
                    // && t.LanguageCode == languageCode (Web ürününün kapsamına göre tartışılabilir)
                    )
                );
        }


        public async Task UpdateAsync(ProductEntity product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task<ProductEntity?> GetBySlugAsync(string slug, string languageCode)
        {
            return await _context.Products
                .Include(p => p.Translations)
                .Include(p => p.Category)
                    .ThenInclude(c => c!.Translations)
                .FirstOrDefaultAsync(p =>
                    p.Translations.Any(t =>
                        t.Slug == slug
                    // &&  t.LanguageCode == languageCode (Web ürününün kapsamına göre tartışılabilir)
                    )
                );
        }

        public async Task<PaginatedResult<ProductEntity>> GetFilteredProductsAsync(
     string languageCode, string? searchTerm, Guid? categoryId,
     decimal? minPrice, decimal? maxPrice, string? sortBy,
     int pageNumber, int pageSize)
        {
            var query = _context.Products
                .Include(p => p.Translations)
                .Include(p => p.Category).ThenInclude(c => c!.Translations)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var term = searchTerm.ToLower();
                query = query.Where(p =>
                    p.Translations.Any(t =>
                        t.Name.ToLower().Contains(term)
                    ));
            }

            if (categoryId.HasValue)
                query = query.Where(x => x.CategoryId == categoryId.Value);

            if (minPrice.HasValue)
                query = query.Where(x => x.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(x => x.Price <= maxPrice.Value);

            query = sortBy?.ToLower() switch
            {
                "price_asc" => query.OrderBy(x => x.Price).ThenBy(x => x.Id),
                "price_desc" => query.OrderByDescending(x => x.Price).ThenBy(x => x.Id),
                _ => query.OrderBy(p => p.Translations.Where(t => t.LanguageCode == languageCode).Select(t => t.Name).FirstOrDefault())
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResult<ProductEntity>(items, totalCount, pageNumber, pageSize);
        }
    }
}