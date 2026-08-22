@echo off
cd /d "%~dp0"
echo.
echo   Abriendo la base de datos (Prisma Studio)...
echo   Se abrira en tu navegador: http://localhost:5555
echo.
echo   Para cerrarla: cierra esta ventana o pulsa Ctrl+C
echo.
npx prisma studio
pause
