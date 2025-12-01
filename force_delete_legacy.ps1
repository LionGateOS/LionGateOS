param(
    [string]$RootPath = $(Split-Path -Parent $MyInvocation.MyCommand.Path)
)

Write-Host ""
Write-Host "LionGateOS Phase 3B - Force Delete Legacy Folders" -ForegroundColor Cyan
Write-Host "-------------------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "Root path:" $RootPath
Write-Host ""
Write-Host "This script will permanently and recursively delete the following"
Write-Host "folders if they exist under the root path:"
Write-Host "  - legacy-shell"
Write-Host "  - os-shell-legacy"
Write-Host "  - preview"
Write-Host ""
Write-Host "It will ONLY touch these three folders."
Write-Host ""
$confirm = Read-Host "Press Y then Enter to continue, or anything else to cancel"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

$folders = @("legacy-shell","os-shell-legacy","preview")

foreach ($folder in $folders) {
    $target = Join-Path $RootPath $folder
    if (Test-Path $target) {
        Write-Host ""
        Write-Host "Processing $folder ..." -ForegroundColor Magenta

        # Remove read-only / hidden attributes before delete
        Get-ChildItem -LiteralPath $target -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object {
            try {
                $_.Attributes = 'Normal'
            } catch {}
        }

        try {
            Remove-Item -LiteralPath $target -Recurse -Force -ErrorAction Stop
            if (-not (Test-Path $target)) {
                Write-Host "  [+] Successfully deleted $folder" -ForegroundColor Green
            } else {
                Write-Host "  [!] Still exists after delete attempt (permissions/locks)" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "  [!] Error deleting $folder :" $_.Exception.Message -ForegroundColor Red
        }
    }
    else {
        Write-Host ""
        Write-Host "Skipping $folder (folder not found at root)" -ForegroundColor DarkYellow
    }
}

Write-Host ""
Write-Host "Phase 3B cleanup completed. You can close this window." -ForegroundColor Cyan
