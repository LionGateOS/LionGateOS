# ============================================================
# UniversalBackupAndOpen.ps1
# Project Lifesaver – Fixed Backup & Open EstimatorHome.tsx
# Dynamically finds the file, creates backup, opens in Notepad
# ============================================================

# Resolve script location (project root)
$ScriptPath = $MyInvocation.MyCommand.Path
$AppRoot = Split-Path -Parent $ScriptPath

# Dynamically find EstimatorHome.tsx under src
$EstimatorFile = Get-ChildItem -Path $AppRoot -Recurse -Filter EstimatorHome.tsx | Select-Object -First 1 | Select-Object -ExpandProperty FullName

if (-not $EstimatorFile) {
    Write-Host "ERROR: Could not find EstimatorHome.tsx in the project." -ForegroundColor Red
    exit 1
}

# Backup directory (canonical location)
$BackupDir = "I:\PROJECTS BACKUPS\SmartQuoteAI_Backups"

# Ensure backup directory exists
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Timestamp
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Create a timestamped backup of EstimatorHome.tsx
$EstimatorBackup = Join-Path $BackupDir ("EstimatorHome_Backup_" + $Timestamp + ".tsx")
Copy-Item -Path $EstimatorFile -Destination $EstimatorBackup -Force

Write-Host "Backup created successfully:"
Write-Host "  $EstimatorBackup"
Write-Host ""

# Open the backup file in Notepad so you can copy the content
Start-Process notepad.exe $EstimatorBackup

Write-Host "EstimatorHome.tsx backup opened in Notepad. Copy all contents and paste them here."

# =====================
# RUN COMMAND
# =====================
# In PowerShell, run:
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# .\UniversalBackupAndOpen.ps1