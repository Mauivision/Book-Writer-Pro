@echo off
setlocal EnableDelayedExpansion
title Lumora Gauntlet 3D - Sandbox

echo ================================================
echo   LUMORA GAUNTLET 3D - SANDBOX BUILD
echo ================================================
echo.

set "GODOT="

:: Check PATH first
where godot >nul 2>&1
if %errorlevel%==0 (
    set "GODOT=godot"
    goto launch
)

:: Common installation paths (WinGet portable + standard installs)
set "PATHS[0]=C:\Users\hawai\Godot\Godot_v4.3-stable_win64.exe"
set "PATHS[1]=%LOCALAPPDATA%\Microsoft\WinGet\Packages\GodotEngine.GodotEngine_Microsoft.Winget.Source_8wekyb3d8bbwe\Godot_v4.6.3-stable_win64.exe"
set "PATHS[2]=C:\Program Files\Godot\Godot.exe"
set "PATHS[3]=C:\Program Files (x86)\Godot\Godot.exe"
set "PATHS[4]=%LOCALAPPDATA%\Programs\Godot\Godot.exe"

for /L %%i in (0,1,4) do (
    if exist "!PATHS[%%i]!" (
        set "GODOT=!PATHS[%%i]!"
        goto launch
    )
)

echo [ERROR] Godot not found automatically.
echo.
echo Please edit this .bat file and set the GODOT variable manually.
echo Example:
echo    set "GODOT=C:\Path\To\Your\Godot.exe"
echo.
pause
exit /b 1

:launch
echo Launching Godot editor (Lumora Gauntlet 3D)...
echo Project: %~dp0
echo.

start "" "%GODOT%" --editor --path "%~dp0"
exit /b 0
