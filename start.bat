@echo off
echo ========================================
echo   E-Voting System - Quick Start
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm start"

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   ✅ Servers Starting!
echo ========================================
echo.
echo 🔧 Backend:  http://localhost:3001
echo 🎨 Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
