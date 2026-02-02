# Services.Product.API.Dockerfile

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Services.Product.API/Services.Product.API.csproj", "Services.Product.API/"]
COPY ["Services.Product.Application/Services.Product.Application.csproj", "Services.Product.Application/"]
COPY ["Services.Product.Domain/Services.Product.Domain.csproj", "Services.Product.Domain/"]
COPY ["Services.Product.Infrastructure/Services.Product.Infrastructure.csproj", "Services.Product.Infrastructure/"]
COPY ["Shared.Kernel/Shared.Kernel.csproj", "Shared.Kernel/"]

RUN dotnet restore "Services.Product.API/Services.Product.API.csproj"

COPY . .
WORKDIR "/src/Services.Product.API"
RUN dotnet build "Services.Product.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Services.Product.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Services.Product.API.dll"]