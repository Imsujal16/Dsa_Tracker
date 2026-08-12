@echo off
title SJ Code - C++ Editor & Auto GitHub Sync
echo ===================================================
echo             Starting SJ Code Platform
echo ===================================================
echo.

:: Start Backend
echo Starting Backend Compiler & Git Scheduler (Port 5000)...
start "SJ Code Backend" cmd /k "cd backend && node server.js"

:: Wait 2 seconds for backend to start
timeout /t 2 /nobreak > NUL

:: Start Frontend
echo Starting Editor UI (Port 3000)...
start "SJ Code Frontend" cmd /k "cd frontend && npm run dev"

:: Wait 3 seconds then open browser
timeout /t 3 /nobreak > NUL
echo Opening SJ Code in your browser...
start http://localhost:3000

echo.
echo ===================================================
echo SJ Code is running! Keep this window open.
echo To stop the application, close the open command windows.
echo ===================================================
pause
