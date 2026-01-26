# ============================================================
# UniversalBackupAndOpen_MASTER.ps1
# Project Lifesaver – Canonical Zero-Parameter Backup Script
# TGZ only · App-local · No prompts · No parameters
# ============================================================

# Resolve script location (app root)
$ScriptPath = $MyInvocation.MyCommand.Path
$AppRoot = Split-Path -Parent $ScriptPath
$AppName = Split-Path $AppRoot -Leaf

# Backup directory
$BACKUP_DIR = "I:\PROJECTS BACKUPS\Calendar_Backups"
$BACKUP_DIR = "I:\PROJECTS BACKUPS\Calendar_Backups"
$BACKUP_DIR = "I:\PROJECTS BACKUPS\Calendar_Backups"
}

# Timestamp
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Backup file name
$BACKUP_DIR = "I:\PROJECTS BACKUPS\Calendar_Backups"

Write-Host "Creating backup for app:"
Write-Host "  $AppRoot"
Write-Host ""

# Create TGZ backup of entire app directory, excluding /backups and common heavy dirs
# Note: We exclude /backups to avoid attempting to add the archive into itself.
$ExcludeArgs = @(
    "--exclude=backups",
    "--exclude=node_modules",
    "--exclude=dist",
    "--exclude=.git"
)

tar -czf $BackupFile @ExcludeArgs -C $AppRoot .

Write-Host "Backup created successfully:"
Write-Host "  $BackupFile"
Write-Host ""

# Open app root for visual confirmation
Start-Process explorer.exe $AppRoot