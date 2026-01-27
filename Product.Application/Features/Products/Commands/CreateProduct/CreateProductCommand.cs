using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Product.Application.Interfaces;
using Product.Domain.Entities;

namespace Product.Application.Features.Products.Commands.CreateProduct
{
    public class CreateProductCommand : IRequest<Guid>
    {
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
    }

    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
    {
        private readonly IProductRepository _repository;
        private readonly IDistributedCache _cache;

        public CreateProductCommandHandler(IProductRepository repository, IDistributedCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var newProduct = new ProductEntity
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Price = request.Price,
                Stock = request.Stock
            };

            await _repository.AddAsync(newProduct);

            await _cache.RemoveAsync("all_products", cancellationToken);

            return newProduct.Id;
        }
    }
}
