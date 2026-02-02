# Services.Log.API.Dockerfile

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Services.Log.API/Services.Log.API.csproj", "Services.Log.API/"]
COPY ["Services.Log.Application/Services.Log.Application.csproj", "Services.Log.Application/"]
COPY ["Services.Log.Domain/Services.Log.Domain.csproj", "Services.Log.Domain/"]
COPY ["Services.Log.Infrastructure/Services.Log.Infrastructure.csproj", "Services.Log.Infrastructure/"]
COPY ["Shared.Kernel/Shared.Kernel.csproj", "Shared.Kernel/"]

RUN dotnet restore "Services.Log.API/Services.Log.API.csproj"

COPY . .
WORKDIR "/src/Services.Log.API"
RUN dotnet build "Services.Log.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Services.Log.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Services.Log.API.dll"]