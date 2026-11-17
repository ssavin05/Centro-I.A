@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Centro I.A. - Prueba local aislada
echo PRUEBA LOCAL: no usa tu cuenta ni datos de Supabase.
echo Usuario: http://127.0.0.1:4174/workspace.html?as=user
echo Empresa: http://127.0.0.1:4174/workspace.html?as=company
node scripts/loyalty-preview.mjs
if errorlevel 1 echo Revisa Node 22.13 o superior y las dependencias instaladas con pnpm.
pause
