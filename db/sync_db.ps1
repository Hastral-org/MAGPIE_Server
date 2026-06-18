# Configuration (Dynamic paths based on script location inside the db/ folder)
$BackupDir  = "C:\Users\Marika\db_backups"
$DbDir      = $PSScriptRoot  
$ProjectDir = Split-Path -Parent $DbDir 
$LogDir     = Join-Path $ProjectDir "logs"

# Absolute file paths calculated dynamically
$WorldDbPath  = Join-Path $DbDir "world.db"
$ServerDbPath = Join-Path $DbDir "server.db"

# Generate custom timestamp format (YYYYMMDDHHMM and YYYYMMDD for logs)
$CTZ = Get-Date -Format "yyyyMMddHHmm"
$DateOnly = Get-Date -Format "yyyyMMdd"
$LogFile = Join-Path $LogDir "backend$DateOnly.log"

# Setup local backup paths
$WorldBackupFile  = Join-Path $BackupDir "world_$CTZ.db"
$ServerBackupFile = Join-Path $BackupDir "server_$CTZ.db"

# Ensure directories exist
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir | Out-Null
}

# Logging function
function LogMessage {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry -ErrorAction SilentlyContinue
}

LogMessage "=== sync_db.ps1 START ==="

# Step 1: Force journal drop to override background locks and smash WAL data into main binaries
LogMessage "📦 1/5 Forcing absolute WAL integration into main files..."
Set-Location $ProjectDir

# Switching to DELETE mode forces full data integration and completely deletes local wal/shm files
sqlite3 $WorldDbPath "PRAGMA journal_mode = DELETE;"
sqlite3 $ServerDbPath "PRAGMA journal_mode = DELETE;"

if ($LASTEXITCODE -ne 0) {
    LogMessage "❌ Failed to toggle journal mode to DELETE. Aborting."
    Exit 1
}

# Step 2: Create local time-stamped backups
LogMessage "🗄️ 2/5 Creating local archival snapshots..."
sqlite3 $WorldDbPath ".backup $WorldBackupFile"
sqlite3 $ServerDbPath ".backup $ServerBackupFile"

if ($LASTEXITCODE -ne 0) {
    LogMessage "❌ Failed to create local backups. Aborting."
    Exit 1
}
LogMessage "✅ Local backups created: world_$CTZ.db, server_$CTZ.db"

# Step 3: Confirm server is stopped
LogMessage "⚠️  3/5 Preparation: Ensure your server app is STOPPED (Ctrl+C on Ubuntu)!"
Read-Host "Press [ENTER] to confirm the remote server is stopped and begin the clean sync"

# Step 4: Backup remote DBs before overwriting
LogMessage "🗄️ 4/5 Backing up remote databases on magpie-gcp..."
$RemoteBackupDir = "~/db_backups"
$RemoteBackupCmd = "mkdir -p $RemoteBackupDir && " +
    "cp ~/MAGPIE_Server/db/world.db $RemoteBackupDir/world_$(Get-Date +%Y%m%d%H%M).db 2>/dev/null || true && " +
    "cp ~/MAGPIE_Server/db/server.db $RemoteBackupDir/server_$(Get-Date +%Y%m%d%H%M).db 2>/dev/null || true"
ssh magpie-gcp $RemoteBackupCmd
LogMessage "✅ Remote backup complete (or DBs didn't exist yet)"

# Step 5: CLEANUP and PUSH - Wipe old files on remote, then push fresh backups
LogMessage "🧹 5/5 Clearing remote DB files and syncing fresh databases..."
ssh magpie-gcp "rm -f ~/MAGPIE_Server/db/world.db* ~/MAGPIE_Server/db/server.db*"

scp $WorldBackupFile magpie-gcp:~/MAGPIE_Server/db/world.db
if ($LASTEXITCODE -ne 0) {
    LogMessage "❌ SCP transfer of world.db failed."
    Exit 1
}

scp $ServerBackupFile magpie-gcp:~/MAGPIE_Server/db/server.db
if ($LASTEXITCODE -ne 0) {
    LogMessage "❌ SCP transfer of server.db failed."
    Exit 1
}
LogMessage "✅ Both databases successfully uploaded to magpie-gcp"

# Restore WAL mode on remote for performance
LogMessage "⚡ Restoring remote production databases to WAL performance mode..."
ssh magpie-gcp "sqlite3 ~/MAGPIE_Server/db/world.db 'PRAGMA journal_mode=WAL;' && sqlite3 ~/MAGPIE_Server/db/server.db 'PRAGMA journal_mode=WAL;'"

# Restore local WAL mode
LogMessage "⚡ Restoring local databases to WAL performance mode..."
sqlite3 $WorldDbPath "PRAGMA journal_mode = WAL;"
sqlite3 $ServerDbPath "PRAGMA journal_mode = WAL;"

LogMessage "✅ sync_db.ps1 completed successfully!"
LogMessage "=== sync_db.ps1 END ==="