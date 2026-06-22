@echo off
echo ========================================
echo   Lumora Gauntlet 3D - Sandbox Build
echo ========================================
echo.

set GODOT_PATH=

if exist "C:\Users\hawai\Godot\Godot_v4.3-stable_win64.exe" set GODOT_PATH=C:\Users\hawai\Godot\Godot_v4.3-stable_win64.exe
if exist "C:\Program Files\Godot\Godot.exe" set GODOT_PATH=C:\Program Files\Godot\Godot.exe
if exist "C:\Program Files (x86)\Steam\steamapps\common\Godot Engine\godot.exe" set GODOT_PATH="C:\Program Files (x86)\Steam\steamapps\common\Godot Engine\godot.exe"
if exist "%LOCALAPPDATA%\Programs\Godot\Godot.exe" set GODOT_PATH="%LOCALAPPDATA%\Programs\Godot\Godot.exe"

if "%GODOT_PATH%"=="" (
    echo Godot not found automatically.
    echo.
    echo Please edit this file and set GODOT_PATH to your Godot.exe location.
    echo Example:
    echo    set GODOT_PATH="C:\Path\To\Godot.exe"
    echo.
    pause
    exit /b
)

echo Launching Lumora Gauntlet 3D (play mode)...
echo.

start "" "%GODOT_PATH%" --path "%~dp0"
exit /b 0
