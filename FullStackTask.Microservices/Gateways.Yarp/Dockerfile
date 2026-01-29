# Gateways.Yarp.Dockerfile

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

USER root
RUN apt-get update && apt-get install -y curl libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*

EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Gateways.Yarp/Gateways.Yarp.csproj", "Gateways.Yarp/"]
COPY ["Shared.Kernel/Shared.Kernel.csproj", "Shared.Kernel/"]

RUN dotnet restore "Gateways.Yarp/Gateways.Yarp.csproj"

COPY . .
WORKDIR "/src/Gateways.Yarp"
RUN dotnet build "Gateways.Yarp.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Gateways.Yarp.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Gateways.Yarp.dll"]