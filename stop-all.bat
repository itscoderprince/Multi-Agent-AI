@echo off
title Multi-Agent AI - 1-Click Stopper
echo ========================================================
echo        Multi-Agent AI - Stopping All Services...
echo ========================================================
echo.

echo Stopping Redis Container...
docker compose -f backend\docker-compose.yml down

echo Stopping all Node.js dev processes...
taskkill /f /im node.exe 2>nul

echo.
echo ========================================================
echo   All servers and Redis have been stopped!
echo ========================================================
pause
