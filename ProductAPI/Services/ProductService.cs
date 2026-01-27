
using Product.Application.DTOs;
using Product.Infrastructure.Repositories;

namespace ProductAPI.Services
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllProductsAsync();
        Task AddProductAsync(CreateProductDto productDto);
    }

    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ProductDto>> GetAllProductsAsync()
        {
            var products = await _repository.GetAllAsync();
            return products.Select(p => new ProductDto(p.Id, p.Name, p.Price, p.Stock)).ToList();
        }

        public async Task AddProductAsync(CreateProductDto productDto)
        {
            var newProduct = new Product
            {
                Name = productDto.Name,
                Price = productDto.Price,
                Stock = productDto.Stock
            };
            await _repository.AddAsync(newProduct);
        }
    }
}