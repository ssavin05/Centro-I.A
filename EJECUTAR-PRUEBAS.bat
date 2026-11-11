@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (echo Instala Node.js 22.13 o superior.& pause & exit /b 1)
npm test
pause