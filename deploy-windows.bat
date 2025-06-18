@echo off
REM Redis Collector Node - One-command deployment script for Windows
REM Usage: deploy-windows.bat [n8n_user_home_path]
REM Example: deploy-windows.bat C:\Users\YourName\.n8n

setlocal enabledelayedexpansion

echo 🚀 Starting Redis Collector Node deployment...

REM Default n8n home path
if "%~1"=="" (
    set "N8N_HOME=%USERPROFILE%\.n8n"
) else (
    set "N8N_HOME=%~1"
)

set "CUSTOM_DIR=%N8N_HOME%\custom"
set "NODE_DIR=%CUSTOM_DIR%\n8n-nodes-redis-collector"

echo 📁 N8N Home: %N8N_HOME%
echo 📦 Node Directory: %NODE_DIR%

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found
    echo Please run this script from the gomtin project root directory
    pause
    exit /b 1
)

if not exist "src\nodes\RedisCollector\RedisCollector.node.ts" (
    echo ❌ Error: RedisCollector.node.ts not found
    echo Please run this script from the gomtin project root directory
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Build the project
echo 🔨 Building project...
npm run build
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

REM Check if build was successful
if not exist "dist" (
    echo ❌ Build failed - dist directory not found
    pause
    exit /b 1
)

REM Create custom directory if it doesn't exist
echo 📁 Creating custom nodes directory...
if not exist "%CUSTOM_DIR%" mkdir "%CUSTOM_DIR%"

REM Remove existing installation if present
if exist "%NODE_DIR%" (
    echo 🗑️  Removing existing installation...
    rmdir /s /q "%NODE_DIR%"
)

REM Copy built files
echo 📋 Copying built files...
xcopy /e /i /y "dist" "%NODE_DIR%"
if errorlevel 1 (
    echo ❌ Failed to copy files
    pause
    exit /b 1
)

REM Copy package.json for metadata
copy "package.json" "%NODE_DIR%\" >nul

REM Check if n8n is running
tasklist /fi "imagename eq node.exe" 2>nul | find /i "n8n" >nul
if %errorlevel%==0 (
    echo ⚠️  n8n appears to be running. You need to restart it to load the new node.
    echo 💡 Stop n8n and restart it manually
) else (
    echo ✅ n8n is not running. Start it with: n8n start
)

echo.
echo 🎉 Redis Collector Node deployed successfully!
echo 📍 Location: %NODE_DIR%
echo.
echo 📋 Next steps:
echo    1. Restart n8n if it's running
echo    2. Open n8n web interface
echo    3. Look for 'Redis Collector' in the nodes panel
echo.
echo 🔧 Environment variable (optional):
echo    set N8N_CUSTOM_EXTENSIONS=%CUSTOM_DIR%
echo.
echo ✨ Happy automating!
echo.
pause