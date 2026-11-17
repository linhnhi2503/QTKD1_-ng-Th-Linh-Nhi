@echo off
chcp 65001 >nul
echo ========================================================
echo    VCHART SERVICE AGENT - AI BI ENGINE LOCALHOST:8000
echo ========================================================
echo [1/2] Kiem tra may chu Backend...

netstat -ano | findstr :8000 >nul 2>&1
if %errorlevel% neq 0 (
    echo Khoi dong server Uvicorn...
    start /b python -m uvicorn app:app --host 0.0.0.0 --port 8000
    timeout /t 2 >nul
) else (
    echo May chu da chay san tren cong 8000.
)

echo [2/2] Mo trinh duyet Web tai http://localhost:8000/
start http://localhost:8000/

echo.
echo He thong da san sang!
echo ========================================================
