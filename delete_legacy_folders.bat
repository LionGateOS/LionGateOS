@echo off
setlocal ENABLEDELAYEDEXPANSION

echo.
echo LionGateOS Legacy Folder Cleanup
echo --------------------------------
echo This script will permanently delete the following folders, if they exist:
echo   - legacy-shell
echo   - os-shell-legacy
echo   - preview
echo.
echo It will ONLY touch these folders in the current LionGateOS directory.
echo.
pause

cd /d "%~dp0"

for %%D in ("legacy-shell" "os-shell-legacy" "preview") do (
    if exist "%%~D" (
        echo Deleting folder %%~D ...
        rmdir /S /Q "%%~D"
        if exist "%%~D" (
            echo   [!] Failed to delete %%~D (check permissions).
        ) else (
            echo   [+] Successfully deleted %%~D
        )
    ) else (
        echo Skipping %%~D (folder not found).
    )
)

echo.
echo Cleanup complete.
echo You may close this window.
echo.
pause
endlocal
