@echo off
setlocal
title LionGateOS Packaging Utility

set "LION_ROOT=I:\LionGateOS"
set "PS_HELPER=%LION_ROOT%\_package_helper.ps1"

:MAIN_MENU
cls
echo ===============================================
echo LionGateOS Packaging Utility
echo ===============================================
echo 1) Full LionGateOS Snapshot (Recovery / Safety)
echo 2) Clean Module Master (Single App)
echo 3) LionGateOS Chat Handoff Master
echo 4) Exit
echo.
set /p CHOICE=Select an option (1-4): 
echo.

if "%CHOICE%"=="1" goto OPT1
if "%CHOICE%"=="2" goto OPT2
if "%CHOICE%"=="3" goto OPT3
if "%CHOICE%"=="4" goto END

echo Invalid option.
pause
goto MAIN_MENU

:OPT1
set /p CONFIRM=Type FULL to confirm full snapshot: 
if /i not "%CONFIRM%"=="FULL" (
  echo Cancelled.
  pause
  goto MAIN_MENU
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_HELPER%" full
pause
goto MAIN_MENU

:OPT2
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_HELPER%" module
echo.
set /p AGAIN=Do you want to package another module? (y/n): 
if /i "%AGAIN%"=="y" goto OPT2
goto MAIN_MENU

:OPT3
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_HELPER%" handoff
pause
goto MAIN_MENU

:END
echo Exiting.
exit
