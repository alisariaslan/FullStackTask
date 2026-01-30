# Services.Auth.API.Dockerfile

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Services.Auth.API/Services.Auth.API.csproj", "Services.Auth.API/"]
COPY ["Services.Auth.Application/Services.Auth.Application.csproj", "Services.Auth.Application/"]
COPY ["Services.Auth.Domain/Services.Auth.Domain.csproj", "Services.Auth.Domain/"]
COPY ["Services.Auth.Infrastructure/Services.Auth.Infrastructure.csproj", "Services.Auth.Infrastructure/"]
COPY ["Shared.Kernel/Shared.Kernel.csproj", "Shared.Kernel/"]

RUN dotnet restore "Services.Auth.API/Services.Auth.API.csproj"

COPY . .
WORKDIR "/src/Services.Auth.API"
RUN dotnet build "Services.Auth.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Services.Auth.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Services.Auth.API.dll"]