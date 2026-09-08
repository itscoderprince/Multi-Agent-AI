@echo off
title Multi-Agent AI - 1-Click Dev Launcher
echo ========================================================
echo        Multi-Agent AI - Starting All Services...
echo ========================================================
echo.

echo [1/5] Starting Redis Container...
docker compose -f backend\docker-compose.yml up -d
echo.

echo [2/5] Launching API Gateway (Port 1000)...
start "API Gateway (:1000)" cmd /k "cd backend\gateway && npm run dev"

echo [3/5] Launching Auth Service (Port 2000)...
start "Auth Service (:2000)" cmd /k "cd backend\services\auth && npm run dev"

echo [4/5] Launching Chat Service (Port 3000)...
start "Chat Service (:3000)" cmd /k "cd backend\services\chat && npm run dev"

echo [5/5] Launching Agent Service (Port 4000)...
start "Agent Service (:4000)" cmd /k "cd backend\services\agent && npm run dev"

echo [6/6] Launching Frontend (Port 5173)...
start "Frontend (:5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   All 6 services launched successfully!
echo   Frontend : http://localhost:5173
echo   Gateway  : http://localhost:1000
echo   Auth     : http://localhost:2000
echo   Chat     : http://localhost:3000
echo   Agent    : http://localhost:4000
echo   Redis    : localhost:6379
echo ========================================================
echo You can minimize this window.
pause
