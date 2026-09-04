@echo off
title Actualizar Proyecto SENA
echo ==================================================
echo GUARDANDO CAMBIOS EN GITHUB Y FIREBASE...
echo ==================================================
echo.

git add .

set /p mensaje="Escribe que cambiaste (o presiona Enter para usar 'Actualizacion automatica'): "
if "%mensaje%"=="" set mensaje="Actualizacion automatica"

git commit -m "%mensaje%"

echo.
echo [1/2] Subiendo cambios a GitHub...
git push

echo.
echo [2/2] Publicando cambios en Firebase Hosting...
call firebase deploy --only hosting

echo.
echo ==================================================
echo EXITO! Los cambios ya estan en GitHub y en vivo en Firebase.
echo ==================================================
pause
