# ProductAPI.Dockerfile
# Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# 1.Tüm proje dosyalarını kendi klasör yapılarıyla kopyalıyoruz
COPY ["Product.Domain/Product.Domain.csproj", "Product.Domain/"]
COPY ["Product.Application/Product.Application.csproj", "Product.Application/"]
COPY ["Product.Infrastructure/Product.Infrastructure.csproj", "Product.Infrastructure/"]
COPY ["ProductAPI/ProductAPI.csproj", "ProductAPI/"]

# Bağımlılıkları yüklüyoruz
RUN dotnet restore "ProductAPI/ProductAPI.csproj"

# Kalan tüm kaynak kodları kopyalıyoruz
COPY . .

# Build ve Publish
WORKDIR "/src/ProductAPI"
RUN dotnet build "ProductAPI.csproj" -c Release -o /app/build
RUN dotnet publish "ProductAPI.csproj" -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

# Port
EXPOSE 8080

# Başlat
ENTRYPOINT ["dotnet", "ProductAPI.dll"]