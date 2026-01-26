# Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Projeyi kopyalayıp paketleri yüklüyoruz
COPY *.csproj ./
RUN dotnet restore

# Kalan tüm dosyaları kopyalayıp derliyoruz
COPY . .
RUN dotnet publish -c Release -o out

# Runtime imajını kullanıyoruz
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .

# Container port
EXPOSE 8080

# Ayağa kaldır
ENTRYPOINT ["dotnet", "ProductAPI.dll"]