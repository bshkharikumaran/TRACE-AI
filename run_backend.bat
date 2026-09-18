@echo off
echo ===================================================
echo Starting TRACE-AI FastAPI Backend Server...
echo SIH 26189 - Ministry of Home Affairs / NCRB
echo ===================================================
cd /d %~dp0
echo Launching Uvicorn on http://127.0.0.1:8000 ...
.\backend\venv\Scripts\uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
pause
