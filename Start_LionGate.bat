$Content = @'
@echo off
echo ===================================================
echo   LIONGATE OS - CHROME LAUNCHER
echo ===================================================
echo.
echo   [!] Target: Google Chrome
echo   [!] Port: 8081
echo.

:: 1. Open Chrome specifically to the right address
start chrome "http://localhost:8081"

:: 2. Start the server (without the auto-open flag '-o')
cd /d "I:\LionGateOS"
call npx http-server . -p 8081 -c-1
pause
'@

Set-Content -Path "I:\LionGateOS\Start_LionGate.bat" -Value $Content -Encoding UTF8