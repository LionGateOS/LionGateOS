# UniversalBackupAndOpen.ps1
# Canonical LionGateOS SINGLE-FILE backup + open helper
# Backs up the file currently being modified (default: index.html)
# Then opens the ORIGINAL file in Notepad.
# Backup destination is the external canonical directory.

param(
    [string]$FileName = "index.html"
)

$ErrorActionPreference = "Stop"

# Root = current working directory (where the file lives)
$root = Get-Location
$sourceFile = Join-Path $root $FileName

if (!(Test-Path $sourceFile)) {
    Write-Error "File not found: $sourceFile"
    exit 1
}

# CANONICAL BACKUP LOCATION (LOCKED)
$backupRoot = "I:\PROJECTS BACKUPS\LionGateOS_Backups"

if (!(Test-Path $backupRoot)) {
    New-Item -ItemType Directory -Path $backupRoot | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$baseName = [System.IO.Path]::GetFileName($FileName)
$backupFile = Join-Path $backupRoot "$baseName.BACKUP_$timestamp"

Copy-Item $sourceFile -Destination $backupFile -Force

Write-Host "Backup completed:"
Write-Host $backupFile

# Open the ORIGINAL file in Notepad (workflow requirement)
Start-Process notepad.exe $sourceFile
