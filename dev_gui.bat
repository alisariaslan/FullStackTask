@echo off
title AliSariaslan - Developer CLI

set BACKEND_PROJECT=ProductAPI
set DOCKER_COMPOSE_FILE=docker-compose.yml

:MENU
cls
echo    Backend: %BACKEND_PROJECT%
echo        1. Docker Up (Normal Baslat)
echo        2. Docker Up --Build (Kod degisti, yeniden derle ve baslat)
echo        3. Docker Hard Reset (Cache sil, her seyi sil ve sifirdan kur)
echo        4. Docker Down (Konteynerleri durdur ve sil)
echo        5. Migration Ekle (dotnet ef migrations add)
echo        6. Veritabanini Guncelle (dotnet ef database update)
echo        7. Son Migration'i Geri Al (dotnet ef migrations remove)
echo        0. CIKIS

set /p secim="Islem Seciniz (0-7): "

if "%secim%"=="1" goto DOCKER_UP
if "%secim%"=="2" goto DOCKER_BUILD
if "%secim%"=="3" goto DOCKER_HARD_RESET
if "%secim%"=="4" goto DOCKER_DOWN
if "%secim%"=="5" goto EF_ADD
if "%secim%"=="6" goto EF_UPDATE
if "%secim%"=="7" goto EF_REMOVE
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
cd %BACKEND_PROJECT%
dotnet ef migrations add %migName%
cd ..
pause
goto MENU

:EF_UPDATE
echo.
cd %BACKEND_PROJECT%
echo Veritabani guncelleniyor (Migrate ediliyor)...
dotnet ef database update
cd ..
pause
goto MENU

:EF_REMOVE
echo.
echo Son migration geri aliniyor...
cd %BACKEND_PROJECT%
dotnet ef migrations remove
cd ..
pause
goto MENU