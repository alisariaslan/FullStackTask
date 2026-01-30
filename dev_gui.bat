@echo off
title AliSariaslan - Developer CLI

set PRODUCT_API_PROJECT=Services.Product.API
set PRODUCT_INFRA_PROJECT=Services.Product.Infrastructure
set DOCKER_COMPOSE_FILE=docker-compose.yml
set PRODUCT_IMAGES_PATH=Services.Product.API\wwwroot\images
set ROOT_DIR=%~dp0
set MICROSERVICES_DIR=%ROOT_DIR%FullStackTask.Microservices

for %%D in (
    "%MICROSERVICES_DIR%"
    "%MICROSERVICES_DIR%\%PRODUCT_API_PROJECT%"
    "%MICROSERVICES_DIR%\%PRODUCT_INFRA_PROJECT%"
    "%DOCKER_COMPOSE_FILE%"
) do (
    if not exist %%D (
        echo Missing: %%D
        pause
        exit /b 1
    )
)

:MENU
cls
echo    Backend: %PRODUCT_API_PROJECT%
echo        1. Docker Up (Start containers)
echo        2. Docker Up --Build (Rebuild and start)
echo        3. Docker Hard Reset (Remove containers, images, volumes)
echo        4. Docker Down (Stop and remove containers)
echo        5. [Product.API] Add Migration (dotnet ef migrations add)
echo        6. [Product.API] Update Database (dotnet ef database update)
echo        7. [Product.API] Remove Last Migration (dotnet ef migrations remove)
echo        8. Open Backend Logs Folder
echo        9. [Product.API] Open Product Images (Uploads) Folder
echo       10. [Frontend] Restart (Recreate only frontend)
echo        0. EXIT
set /p secim="Select an option (0-9): "

if "%secim%"=="1" goto DOCKER_UP
if "%secim%"=="2" goto DOCKER_BUILD
if "%secim%"=="3" goto DOCKER_HARD_RESET
if "%secim%"=="4" goto DOCKER_DOWN
if "%secim%"=="5" goto EF_ADD
if "%secim%"=="6" goto EF_UPDATE
if "%secim%"=="7" goto EF_REMOVE
if "%secim%"=="8" goto OPEN_LOGS
if "%secim%"=="9" goto OPEN_IMAGES
if "%secim%"=="10" goto FRONTEND_RESTART
if "%secim%"=="0" exit
goto MENU

:DOCKER_UP
echo.
echo Starting Docker containers...
docker-compose up
pause
goto MENU

:DOCKER_BUILD
echo.
echo Rebuilding and starting containers...
docker-compose up --build
pause
goto MENU

:DOCKER_HARD_RESET
echo.
echo !!! WARNING: Containers, images, networks, and volumes will be removed !!!
pause
docker-compose down --rmi all --volumes --remove-orphans
echo.
docker-compose up --build --force-recreate
pause
goto MENU

:DOCKER_DOWN
echo.
echo Stopping Docker containers...
docker-compose down
pause
goto MENU

:EF_ADD
echo.
echo !!! Migration files will be added to the Infrastructure layer !!!
set /p migName="Enter migration name: "
echo.
pushd "%MICROSERVICES_DIR%"
dotnet ef migrations add %migName% --project %PRODUCT_INFRA_PROJECT% --startup-project %PRODUCT_API_PROJECT%
popd
pause
goto MENU

:EF_UPDATE
echo.
echo Updating database...
pushd "%MICROSERVICES_DIR%"
dotnet ef database update --project %PRODUCT_INFRA_PROJECT% --startup-project %PRODUCT_API_PROJECT%
popd
pause
goto MENU

:EF_REMOVE
echo.
echo Removing last migration...
pushd "%MICROSERVICES_DIR%"
dotnet ef migrations remove --project %PRODUCT_INFRA_PROJECT% --startup-project %PRODUCT_API_PROJECT%
popd
pause
goto MENU

:OPEN_LOGS
echo.
echo Opening backend logs folder...
if not exist backend-logs (
    echo backend-logs folder not found, creating...
    mkdir backend-logs
)
start backend-logs
pause
goto MENU

:OPEN_IMAGES
echo.
echo Opening images (uploads) folder... (%PRODUCT_IMAGES_PATH%)
if not exist "%PRODUCT_IMAGES_PATH%" (
    echo Images folder does not exist, creating...
    mkdir "%PRODUCT_IMAGES_PATH%"
)
start "" "%PRODUCT_IMAGES_PATH%"
goto MENU

:FRONTEND_RESTART
echo.
echo Restarting frontend container only...
docker-compose stop frontend
docker-compose rm -f frontend
docker-compose up -d frontend
pause
goto MENU
