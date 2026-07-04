[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [Alias("level")]
    [string[]]$Lvl,

    [Parameter(Mandatory = $false)]
    [string]$From,

    [Parameter(Mandatory = $false)]
    [string]$To,

    [Parameter(Mandatory = $false)]
    [switch]$Del,

    [Parameter(Mandatory = $false)]
    [switch]$DryRun,

    [Parameter(Mandatory = $false)]
    [string]$LocalDir = "C:\Users\Marika\matheraptor\tmp\MAGPIE_Server\logs",

    [Parameter(Mandatory = $false)]
    [string]$RemoteDir = "~/MAGPIE_Server/logs",

    [Parameter(Mandatory = $false)]
    [string]$HostName = "magpie-gcp"
)

$ErrorActionPreference = "Stop"
$LogFile = Join-Path $LocalDir "pull_log.log"

function log_message {
    param ([string]$Message)
    $LogTimestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$LogTimestamp] $Message"
    Write-Host $LogEntry
    if ($LocalDir -and (Test-Path $LocalDir)) {
        Add-Content -Path $LogFile -Value $LogEntry -ErrorAction SilentlyContinue
    }
}

log_message "=== pull_log.ps1 START ==="

# Check local directory
if (-not (Test-Path $LocalDir)) {
    log_message "Creating local log directory: $LocalDir"
    New-Item -ItemType Directory -Path $LocalDir | Out-Null
}

# 1. Fetch remote file list
log_message "Listing remote logs in ${HostName}:$RemoteDir..."
$tempErrFile = [System.IO.Path]::GetTempFileName()
try {
    $remoteFiles = ssh -n -o BatchMode=yes $HostName "ls -1 $RemoteDir" 2>$tempErrFile
    $exitCode = $LASTEXITCODE
} catch {
    $exitCode = 1
    log_message "❌ ssh execution exception: $_"
}

if ($exitCode -ne 0 -or $null -eq $remoteFiles) {
    $errContent = Get-Content $tempErrFile -Raw
    # Clean up error content from GCP tunnel noise if any
    $cleanErr = $errContent -replace '(?s)Traceback.*?(stdin ReadFile failed|stdin connection failed)', ''
    $cleanErr = $cleanErr.Trim()
    
    if ($cleanErr) {
        log_message "❌ Failed to list remote directory (exit code: $exitCode). Error: $cleanErr"
    } else {
        log_message "❌ Failed to list remote directory (exit code: $exitCode)"
    }
    Remove-Item $tempErrFile -ErrorAction SilentlyContinue
    return
}
Remove-Item $tempErrFile -ErrorAction SilentlyContinue

log_message "Found $($remoteFiles.Count) files on remote. Filtering..."

# 2. Filter files
$matchingFiles = @()

foreach ($file in $remoteFiles) {
    $file = $file.Trim()
    if ($file -match "^([a-zA-Z_]+)(\d{8})?\.log$") {
        $fileLevel = $Matches[1]
        $fileDate = $Matches[2] # might be empty if no date
        
        $match = $true

        # Level filter
        if ($Lvl -and $Lvl.Count -gt 0) {
            if ($fileLevel -notin $Lvl) {
                $match = $false
            }
        }

        # From Date filter
        if ($match -and $From) {
            if (-not $fileDate -or [int]$fileDate -lt [int]$From) {
                $match = $false
            }
        }

        # To Date filter
        if ($match -and $To) {
            if (-not $fileDate -or [int]$fileDate -gt [int]$To) {
                $match = $false
            }
        }

        if ($match) {
            $matchingFiles += [PSCustomObject]@{
                FileName = $file
                Level    = $fileLevel
                Date     = $fileDate
            }
        }
    }
}

if ($matchingFiles.Count -eq 0) {
    log_message "No matching log files found based on the provided filters."
    return
}

log_message "Matching files to pull ($($matchingFiles.Count)):"
foreach ($f in $matchingFiles) {
    log_message " - $($f.FileName) (Level: $($f.Level), Date: $($f.Date))"
}

# 3. Pull files via scp
$successCount = 0
$failedCount = 0
$pulledFiles = @()

foreach ($f in $matchingFiles) {
    $fileName = $f.FileName
    log_message "Pulling $fileName..."
    $remotePath = "$RemoteDir/$fileName"
    $localPath = Join-Path $LocalDir $fileName
    
    try {
        if ($DryRun) {
            log_message "DryRun enabled: Skipping pull of $fileName"
        } else {
            scp -o BatchMode=yes "${HostName}:$remotePath" "$localPath"
            if ($LASTEXITCODE -ne 0) {
                throw "SCP failed with exit code $LASTEXITCODE"
            }
        }
        
        if ($DryRun -or $LASTEXITCODE -eq 0) {
            log_message "✅ Successfully pulled $fileName"
            $successCount++
            $pulledFiles += $fileName
        } else {
            log_message "❌ Failed to pull $fileName (exit code: $LASTEXITCODE)"
            $failedCount++
        }
    } catch {
        log_message "❌ Exception while pulling ${fileName}: $_"
        $failedCount++
    }
}

log_message "Pull Summary: $successCount succeeded, $failedCount failed."

# 4. Conditionally delete remote files
if ($Del.IsPresent -and $successCount -gt 0) {
    log_message "Del switch is set. Proceeding to delete successfully pulled logs from remote server..."
    
    foreach ($fileName in $pulledFiles) {
        log_message "Deleting remote log: $fileName..."
        $remotePath = "$RemoteDir/$fileName"
        try {
            ssh -n -o BatchMode=yes $HostName "rm $remotePath"
            if ($LASTEXITCODE -eq 0) {
                log_message "✅ Deleted remote log $fileName"
            } else {
                log_message "❌ Failed to delete remote log $fileName (exit code: $LASTEXITCODE)"
            }
        } catch {
            log_message "❌ Exception while deleting remote log ${fileName}: $_"
        }
    }
}

log_message "=== pull_log.ps1 END ==="