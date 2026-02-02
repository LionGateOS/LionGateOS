
# ============================================================
# UniversalBackupAndOpen.ps1
# Project Lifesaver – Canonical Backup + Edit Script
# TGZ full-app backup + Notepad open for index.html
# ============================================================

# Resolve script location (app root)
$ScriptPath = $MyInvocation.MyCommand.Path
$AppRoot = Split-Path -Parent $ScriptPath
$AppName = Split-Path $AppRoot -Leaf

# Backup directory (static)
$BACKUP_DIR = "I:\PROJECTS BACKUPS\LionGateTravels_Backups"

# Ensure backup directory exists
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

# Timestamp
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Backup file path
$BackupFile = Join-Path $BACKUP_DIR ("{0}_{1}.tgz" -f $AppName, $Timestamp)

Write-Host "Creating backup for app:"
Write-Host "  $AppRoot"
Write-Host ""

# Exclusions
$ExcludeArgs = @(
    "--exclude=backups",
    "--exclude=node_modules",
    "--exclude=dist",
    "--exclude=.git"
)

# Create archive
tar -czf $BackupFile @ExcludeArgs -C $AppRoot .

Write-Host "Backup created successfully:"
Write-Host "  $BackupFile"
Write-Host ""

# Open index.html in Notepad for editing
$IndexFile = Join-Path $AppRoot "index.html"

if (Test-Path $IndexFile) {
    Write-Host "Opening index.html in Notepad..."
    Start-Process notepad.exe $IndexFile
} else {
    Write-Host "WARNING: index.html not found in app root."
}

# Open app root in Explorer (unchanged behavior)
Start-Process explorer.exe $AppRoot
