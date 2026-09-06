@echo off
echo =========================================================
echo Starting Personal Finance App in Production Mode
echo =========================================================

echo 1. Checking PostgreSQL Database connection...
set PGPASSWORD=1234
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d financedb -w -c "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Could not verify PostgreSQL automatically. Ensuring service is running...
    net start postgresql-x64-18 >nul 2>&1
)

echo 2. Launching Backend Spring Boot Application (Port 8080)...
start "Finance Backend" java -jar backend\target\springapp-0.0.1-SNAPSHOT.jar

echo 3. Launching Frontend Production Server (Port 8081)...
start "Finance Frontend" cmd /c "cd frontend && npm run preview"

echo =========================================================
echo Fullstack App is launching!
echo Frontend UI: http://localhost:8081
echo Backend API: http://localhost:8080/api
echo =========================================================
