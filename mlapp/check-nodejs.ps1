# Node.js Installation Checker and Guide
Write-Host "=== Node.js Installation Checker ===" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is in PATH
Write-Host "Checking for Node.js in PATH..." -ForegroundColor Yellow
$nodeInstalled = $false
$npmInstalled = $false

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
        $nodeInstalled = $true
    }
} catch {
    $nodeInstalled = $false
}

# Check if npm is in PATH
Write-Host "Checking for npm in PATH..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "npm found: $npmVersion" -ForegroundColor Green
        $npmInstalled = $true
    }
} catch {
    $npmInstalled = $false
}

Write-Host ""

# Check common installation paths
Write-Host "Checking common installation locations..." -ForegroundColor Yellow
$commonPaths = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe"
)

$foundPath = $null
foreach ($path in $commonPaths) {
    if (Test-Path $path) {
        Write-Host "Found Node.js at: $path" -ForegroundColor Green
        $foundPath = $path
        break
    }
}

Write-Host ""

# Results and recommendations
if ($nodeInstalled -and $npmInstalled) {
    Write-Host "=== Node.js is installed and working! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor Cyan
    Write-Host "  npm run install-all" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
} elseif ($foundPath) {
    Write-Host "=== Node.js is installed but not in PATH ===" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Node.js was found at: $foundPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To fix this:" -ForegroundColor Cyan
    Write-Host "1. Add Node.js to your PATH" -ForegroundColor White
    Write-Host "2. Or reinstall Node.js with Add to PATH checked" -ForegroundColor White
} else {
    Write-Host "=== Node.js is NOT installed ===" -ForegroundColor Red
    Write-Host ""
    Write-Host "To install Node.js:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the LTS version" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. Make sure Add to PATH is checked" -ForegroundColor White
    Write-Host "5. Restart PowerShell after installation" -ForegroundColor White
}
