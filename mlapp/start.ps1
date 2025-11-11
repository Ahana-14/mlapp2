# Start Script for Coding Hours Forecaster
# This script starts both backend and frontend servers

Write-Host "=== Starting Coding Hours Forecaster ===" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is NOT installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "server/node_modules")) {
    Write-Host "Dependencies not installed. Running setup..." -ForegroundColor Yellow
    & .\setup.ps1
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host "Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers
npm run dev


