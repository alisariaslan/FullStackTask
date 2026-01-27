using MediatR;
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

        public CreateProductCommandHandler(IProductRepository repository)
        {
            _repository = repository;
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
            return newProduct.Id;
        }
    }
}
