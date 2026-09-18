@echo off
echo =========================================================================
echo TRACE-AI (SIH 26189) - Launching Backend and Frontend
echo Ministry of Home Affairs - NCRB, Women Safety Division
echo =========================================================================

echo [1/2] Launching TRACE-AI FastAPI Backend (Port 8000)...
start "TRACE-AI Backend (Port 8000)" cmd /k "run_backend.bat"

echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo [2/2] Launching TRACE-AI Frontend (Port 5173)...
start "TRACE-AI Frontend (Port 5173)" cmd /k "run_frontend.bat"

echo.
echo =========================================================================
echo Both services are starting in separate windows:
echo - Backend API:  http://127.0.0.1:8000 (Swagger docs at http://127.0.0.1:8000/docs)
echo - Frontend UI:  http://localhost:5173
echo =========================================================================
echo.
