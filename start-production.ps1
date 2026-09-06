Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Starting Personal Finance App in Production Mode" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Cyan

# 1. Start backend jar
Write-Host "1. Launching Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
$backendJob = Start-Process java -ArgumentList "-jar", "backend\target\springapp-0.0.1-SNAPSHOT.jar" -PassThru

# 2. Start frontend preview server
Write-Host "2. Launching Frontend Production Preview (Port 8081)..." -ForegroundColor Yellow
Set-Location frontend
$frontendJob = Start-Process npm -ArgumentList "run", "preview" -PassThru
Set-Location ..

Write-Host "`nApplication is running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:8081" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8080/api" -ForegroundColor Cyan
