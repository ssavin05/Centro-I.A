@echo off
chcp 65001 >nul
title Centro I.A. - Plataforma
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo ERROR: No se encontro Node.js.
  echo Instala Node.js 22.13 o superior y vuelve a ejecutar este archivo.
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)
echo.
echo =======================================
echo   CENTRO I.A. - VISTA PREVIA OFICIAL
echo =======================================
echo.
echo Abre http://127.0.0.1:4173 en el navegador.
echo No cierres esta ventana mientras uses la aplicacion.
echo.
node scripts/preview.mjs
if errorlevel 1 echo El servidor se cerro con un error.
pause
