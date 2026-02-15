$currentDir = Get-Location
$archiveName = Join-Path $currentDir "KOT-project-$(Get-Date -Format 'yyyy-MM-dd').zip"
$tempDir = Join-Path $currentDir "KOT-archive-temp"

if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "Копирование файлов..." -ForegroundColor Green

Copy-Item -Recurse -Path "src" -Destination "$tempDir\src"
Copy-Item -Recurse -Path "mobile-app" -Destination "$tempDir\mobile-app"
Copy-Item -Recurse -Path "public" -Destination "$tempDir\public" -ErrorAction SilentlyContinue

Copy-Item -Path "package.json" -Destination "$tempDir\package.json"
Copy-Item -Path "package-lock.json" -Destination "$tempDir\package-lock.json" -ErrorAction SilentlyContinue
Copy-Item -Path "vite.config.js" -Destination "$tempDir\vite.config.js"
Copy-Item -Path "index.html" -Destination "$tempDir\index.html"
Copy-Item -Path ".gitignore" -Destination "$tempDir\.gitignore" -ErrorAction SilentlyContinue

Copy-Item -Path "*.md" -Destination "$tempDir\" -ErrorAction SilentlyContinue
Copy-Item -Path "*.txt" -Destination "$tempDir\" -ErrorAction SilentlyContinue

Copy-Item -Path "*.bat" -Destination "$tempDir\" -ErrorAction SilentlyContinue
Copy-Item -Path "*.ps1" -Destination "$tempDir\" -ErrorAction SilentlyContinue
Copy-Item -Path "*.js" -Destination "$tempDir\" -Exclude "node_modules" -ErrorAction SilentlyContinue

Write-Host "Создание архива $archiveName..." -ForegroundColor Green
Compress-Archive -Path "$tempDir\*" -DestinationPath $archiveName -Force

Remove-Item -Recurse -Force $tempDir

Write-Host "`nГотово! Архив создан: $archiveName" -ForegroundColor Green
Write-Host "Размер архива: $([math]::Round((Get-Item $archiveName).Length / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host "`nОтправьте этот архив получателю." -ForegroundColor Yellow
Write-Host "Получателю нужно будет:" -ForegroundColor Yellow
Write-Host "1. Распаковать архив" -ForegroundColor White
Write-Host "2. Открыть папку в терминале" -ForegroundColor White
Write-Host "3. Выполнить: npm install" -ForegroundColor White
Write-Host "4. Запустить: npm run dev" -ForegroundColor White
