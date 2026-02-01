@echo off
title AliSariaslan - Developer CLI

set AUTH_API_PROJECT=Services.Auth.API
set AUTH_INFRA_PROJECT=Services.Auth.Infrastructure
set PRODUCT_API_PROJECT=Services.Product.API
set PRODUCT_INFRA_PROJECT=Services.Product.Infrastructure
set LOG_API_PROJECT=Services.Log.API
set LOG_INFRA_PROJECT=Services.Log.Infrastructure
set DOCKER_COMPOSE_FILE=docker-compose.yml
set IMAGES_PATH=.\images\products\
set ROOT_DIR=%~dp0
set MICROSERVICES_DIR=%ROOT_DIR%FullStackTask.Microservices

:: Klasör kontrolü
if not exist "%MICROSERVICES_DIR%" (
    echo Path error: %MICROSERVICES_DIR% not found.
    pause
    exit /b 1
)

cls
echo ===========================================
echo         AliSariaslan - Developer CLI
echo ===========================================
echo   1. Full Build ^& Start (All)
echo   2. Backend Only (Build ^& Start)
echo   3. Hard Reset (Clean ^& Rebuild)
echo   4. Open Products Image Folder
echo   5. Open All User Interfaces

echo   6. Add Migration (AUTH)
echo   7. Add Migration (PRODUCT)
echo   8. Add Migration (LOG)

echo   9. Update Database
echo   0. EXIT
echo ===========================================
echo.

set /p secim="Select an option: "

if "%secim%"=="1" goto FULL_BUILD
if "%secim%"=="2" goto BACKEND_ONLY
if "%secim%"=="3" goto HARD_RESET
if "%secim%"=="4" goto OPEN_IMAGES
if "%secim%"=="5" goto OPEN_ALL_UI

if "%secim%"=="6" goto EF_ADD_AUTH
if "%secim%"=="7" goto EF_ADD_PRODUCT
if "%secim%"=="8" goto EF_ADD_LOG

if "%secim%"=="9" goto EF_UPDATE
if "%secim%"=="0" exit
exit

:FULL_BUILD
echo.
echo Starting all containers with build...
docker-compose up --build
exit

:BACKEND_ONLY
echo.
echo Starting Backend-only with build...
docker-compose up --build ^
 postgres-db ^
 redis-cache ^
 rabbitmq ^
 seq ^
 auth-api ^
 product-api ^
 gateway-yarp ^
 log-api
exit

:HARD_RESET
echo.
echo Performing Docker Hard Reset...
docker-compose down --rmi all --volumes --remove-orphans
docker-compose up --build --force-recreate
exit

:EF_ADD_AUTH
echo.
set /p migName="Enter migration name: "
pushd "%MICROSERVICES_DIR%"
dotnet ef migrations add %migName% --project %AUTH_INFRA_PROJECT% --startup-project %AUTH_API_PROJECT%
popd
pause
exit

:EF_ADD_PRODUCT
echo.
set /p migName="Enter migration name: "
pushd "%MICROSERVICES_DIR%"
dotnet ef migrations add %migName% --project %PRODUCT_INFRA_PROJECT% --startup-project %PRODUCT_API_PROJECT%
popd
pause
exit

:EF_ADD_LOG
echo.
set /p migName="Enter migration name: "
pushd "%MICROSERVICES_DIR%"
dotnet ef migrations add %migName% --project %LOG_INFRA_PROJECT% --startup-project %LOG_API_PROJECT%
popd
pause
exit

:EF_UPDATE
echo.
pushd "%MICROSERVICES_DIR%"
dotnet ef database update --project %AUTH_INFRA_PROJECT% --startup-project %AUTH_API_PROJECT%
dotnet ef database update --project %PRODUCT_INFRA_PROJECT% --startup-project %PRODUCT_API_PROJECT%
dotnet ef database update --project %LOG_INFRA_PROJECT% --startup-project %LOG_API_PROJECT%
popd
pause
exit

:OPEN_IMAGES
echo.
if not exist "%IMAGES_PATH%" (
    echo Creating directory: %IMAGES_PATH%
    mkdir "%IMAGES_PATH%"
)
start "" "%IMAGES_PATH%"
exit

:OPEN_ALL_UI
echo.
echo Opening all user interfaces...
start "" "http://localhost:6005"   :: Main Web Application
start "" "http://localhost:6006/swagger" :: Auth
start "" "http://localhost:6007/swagger" :: Product
start "" "http://localhost:6009/swagger" :: Log
start "" "http://localhost:6008"   :: Seq
start "" "http://localhost:6003"   :: RabbitMQ
echo All interfaces opened.
exit
