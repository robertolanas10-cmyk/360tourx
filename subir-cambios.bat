@echo off
cd /d "%~dp0"
git add .
git commit -m "Actualizacion %date% %time%"
git push origin main
echo.
echo ✓ Cambios subidos a GitHub correctamente
pause
