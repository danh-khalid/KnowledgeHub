@echo off

cd /d C:\Users\Danh\KnowledgeHub

start "" powershell -WindowStyle Hidden -Command ".\.venv\Scripts\Activate.ps1; python -m uvicorn backend.main:app"

cd /d C:\Users\Danh\KnowledgeHub\frontend

start "" powershell -WindowStyle Hidden -Command "npm run dev"

timeout /t 5 /nobreak >nul

start http://localhost:5173