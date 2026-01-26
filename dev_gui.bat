@echo off
title FullStackTask - Developer CLI

set PROJECT_NAME=ProductAPI
set DOCKER_COMPOSE_FILE=docker-compose.yml

:MENU
cls
echo    Proje: %PROJECT_NAME%
echo        1. Docker Up (Normal Baslat)
echo        2. Docker Up --Build (Kod degisti, yeniden derle ve baslat)
echo        3. Docker Hard Reset (Cache sil, her seyi sil ve sifirdan kur)
echo        4. Docker Down (Konteynerleri durdur ve sil)
echo        5. Migration Ekle (dotnet ef migrations add)
echo        6. Veritabanini Guncelle (dotnet ef database update)
echo        7. Son Migration'i Geri Al (dotnet ef migrations remove)
echo        8. Projeyi Derle (dotnet build)
echo        9. Docker Olmadan Calistir (dotnet run)
echo        10. Hot Reload ile Calistir (dotnet watch)
echo        0. CIKIS

set /p secim="Islem Seciniz (0-11): "

if "%secim%"=="1" goto DOCKER_UP
if "%secim%"=="2" goto DOCKER_BUILD
if "%secim%"=="3" goto DOCKER_HARD_RESET
if "%secim%"=="4" goto DOCKER_DOWN
if "%secim%"=="5" goto EF_ADD
if "%secim%"=="6" goto EF_UPDATE
if "%secim%"=="7" goto EF_REMOVE
if "%secim%"=="8" goto DOTNET_BUILD
if "%secim%"=="9" goto DOTNET_RUN
if "%secim%"=="10" goto DOTNET_WATCH
if "%secim%"=="11" goto DOTNET_DEEP_CLEAN
if "%secim%"=="0" exit

goto MENU

:: -------------------------------------------------------------------------
:: DOCKER BOLUMU
:: -------------------------------------------------------------------------
:DOCKER_UP
echo.
echo Docker konteynerleri baslatiliyor...
docker-compose up
pause
goto MENU

:DOCKER_BUILD
echo.
echo Kod degisiklikleri derleniyor ve baslatiliyor...
docker-compose up --build
pause
goto MENU

:DOCKER_HARD_RESET
echo.
echo !!! DIKKAT: Konteynerler, Aglar ve Cache silinecek !!!
pause
docker-compose down --rmi all --volumes --remove-orphans
echo.
docker-compose up --build --force-recreate
pause
goto MENU

:DOCKER_DOWN
echo.
echo Konteynerler durduruluyor...
docker-compose down
pause
goto MENU

:: -------------------------------------------------------------------------
:: EF CORE BOLUMU
:: -------------------------------------------------------------------------
:EF_ADD
echo.
set /p migName="Migration ismini girin: "
cd %PROJECT_NAME%
dotnet ef migrations add %migName%
cd ..
pause
goto MENU

:EF_UPDATE
echo.
cd %PROJECT_NAME%
echo Veritabani guncelleniyor (Migrate ediliyor)...
dotnet ef database update
cd ..
pause
goto MENU

:EF_REMOVE
echo.
echo Son migration geri aliniyor...
cd %PROJECT_NAME%
dotnet ef migrations remove
cd ..
pause
goto MENU

:: -------------------------------------------------------------------------
:: LOCAL .NET ISLEMLERI
:: -------------------------------------------------------------------------
:DOTNET_BUILD
echo.
echo Proje temizleniyor ve derleniyor...
dotnet clean
dotnet build
pause
goto MENU

:DOTNET_RUN
echo.
echo Uygulama local olarak baslatiliyor...
dotnet run
pause
goto MENU

:DOTNET_WATCH
echo.
echo Hot Reload aktif: dotnet watch...
dotnet watch run
pause
goto MENU

:DOTNET_DEEP_CLEAN
echo.
echo ========================================================
echo   TAM BAKIM VE ONARIM BASLIYOR
echo ========================================================
echo.
echo 1. NuGet Cache temizleniyor...
dotnet nuget locals all --clear
echo.
echo 2. Proje Clean ediliyor (bin/obj temizligi)...
dotnet clean
echo.
echo 3. Paketler zorla (force) restore ediliyor...
dotnet restore --force
echo.
echo 4. Sifirdan Rebuild aliniyor...
dotnet build --no-restore
echo.
echo Islem Tamamlandi! Artik tertemiz bir projeniz var.

pause
goto MENU