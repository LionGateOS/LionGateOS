# ============================================================
# UniversalBackupAndOpen.ps1
# Project Lifesaver – Canonical Zero-Parameter Backup Script
# Behavior:
#   1) TGZ backup of entire module (centralized)
#   2) Open index.html in NOTEPAD for inspection / copy-paste
# ============================================================

$ErrorActionPreference = "Stop"

# Resolve module root
$ScriptPath = $MyInvocation.MyCommand.Path
$AppRoot    = Split-Path -Parent $ScriptPath
$AppName    = Split-Path $AppRoot -Leaf

# Target file to inspect
$IndexFile = Join-Path $AppRoot "index.html"

if (!(Test-Path $IndexFile)) {
    Write-Error "index.html not found in $AppRoot"
    exit 1
}

# Centralized backup directory
$BACKUP_DIR = "I:\PROJECTS BACKUPS\${AppName}_Backups"

if (!(Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

# Timestamp
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Backup file path
$BackupFile = Join-Path $BACKUP_DIR "$AppName`_$Timestamp.tgz"

Write-Host ""
Write-Host "Project Lifesaver Backup"
Write-Host "------------------------"
Write-Host "App Name : $AppName"
Write-Host "App Root : $AppRoot"
Write-Host "Backup   : $BackupFile"
Write-Host ""

# Exclusions to avoid bloat / recursion
$ExcludeArgs = @(
    "--exclude=backups",
    "--exclude=node_modules",
    "--exclude=dist",
    "--exclude=.git"
)

# Create TGZ archive
tar -czf $BackupFile @ExcludeArgs -C $AppRoot .

Write-Host ""
Write-Host "Backup created successfully."
Write-Host "Opening index.html in Notepad..."
Write-Host ""

# OPEN NOTEPAD FOR COPY / PASTE / REVIEW
notepad.exe $IndexFile
