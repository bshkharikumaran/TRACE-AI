@echo off
echo ===================================================
echo Starting TRACE-AI React + Vite Frontend...
echo SIH 26189 - Ministry of Home Affairs / NCRB
echo ===================================================
echo.
echo NOTE: Ensure the backend is running in another terminal
echo       via 'run_backend.bat' (http://127.0.0.1:8000)
echo.
cd /d %~dp0\frontend
npm run dev
pause
