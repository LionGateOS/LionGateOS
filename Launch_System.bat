@echo off
echo Starting LionGateOS Core...
echo System will launch in your default browser.
echo Do not close this window while using the OS.
echo.
call npx http-server . -o -c-1 --port 8080
pause
