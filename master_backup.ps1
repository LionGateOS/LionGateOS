# master_backup.ps1
# LionGateOS Master Backup Script
# Backs up I:\liongateos → I:\PROJECT LIFESAVER\Master\Backups\

$ErrorActionPreference = "Stop"

$SourcePath      = "I:\liongateos"
$BackupRoot      = "I:\PROJECT LIFESAVER\Master\Backups"
$Timestamp       = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFolder    = Join-Path $BackupRoot "LionGateOS_$Timestamp"

# Directories to exclude from backup (large/generated content)
$ExcludeDirs = @(
    "node_modules",
    "dist",
    ".git",
    "_legacy_theme_backup"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LionGateOS Master Backup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source:      $SourcePath"
Write-Host "Destination: $BackupFolder"
Write-Host "Timestamp:   $Timestamp"
Write-Host ""

# Create backup directory
if (!(Test-Path $BackupRoot)) {
    New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null
    Write-Host "Created backup root: $BackupRoot" -ForegroundColor Yellow
}

New-Item -ItemType Directory -Path $BackupFolder -Force | Out-Null

# Build exclusion filter
function ShouldExclude($relativePath) {
    foreach ($dir in $ExcludeDirs) {
        if ($relativePath -like "$dir\*" -or $relativePath -eq $dir) {
            return $true
        }
    }
    return $false
}

# Copy files with exclusion
Write-Host "Copying files..." -ForegroundColor Green

$fileCount = 0
$dirCount  = 0
$totalSize = 0

$allItems = Get-ChildItem -Path $SourcePath -Recurse -Force -ErrorAction SilentlyContinue

foreach ($item in $allItems) {
    $relativePath = $item.FullName.Substring($SourcePath.Length + 1)

    if (ShouldExclude $relativePath) {
        continue
    }

    $destPath = Join-Path $BackupFolder $relativePath

    if ($item.PSIsContainer) {
        if (!(Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            $dirCount++
        }
    } else {
        $destDir = Split-Path $destPath -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            $dirCount++
        }
        Copy-Item -Path $item.FullName -Destination $destPath -Force
        $fileCount++
        $totalSize += $item.Length
    }
}

$sizeMB = [math]::Round($totalSize / 1MB, 2)

# Write backup manifest
$manifest = @"
BACKUP MANIFEST
================
Source:      $SourcePath
Destination: $BackupFolder
Date:        $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Files:       $fileCount
Directories: $dirCount
Total Size:  $sizeMB MB
Excluded:    $($ExcludeDirs -join ', ')
"@

$manifest | Out-File -FilePath (Join-Path $BackupFolder "_BACKUP_MANIFEST.txt") -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Backup Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Files copied:       $fileCount"
Write-Host "Directories created: $dirCount"
Write-Host "Total size:          $sizeMB MB"
Write-Host "Manifest saved to:   $BackupFolder\_BACKUP_MANIFEST.txt"
Write-Host ""
