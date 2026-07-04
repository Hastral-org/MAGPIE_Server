---
type: readme
sourcecode: projects/MAGPIE_Server/scripts/pull_log.ps1
version: 2026 07 02
description: Documentation for the remote log pulling and filtering utility script.
---

# Remote Log Pull Utility (pull_log.ps1)

The [projects/MAGPIE_Server/scripts/pull_log.ps1](projects/MAGPIE_Server/scripts/pull_log.ps1) utility is a PowerShell script designed to automate the retrieval, filtering, and optional cleanup of remote log files from the MAGPIE GCP virtual machine.

It utilizes SSH and SCP over an IAP tunnel, specifically optimized to prevent connection hangs and handle Python tracebacks typical of Google Cloud's Identity-Aware Proxy (IAP) connections.

## Prerequisites

- **Google Cloud SDK**: Must be installed and authenticated on the local machine.
- **SSH Configuration**: A pre-configured SSH host alias named `magpie-gcp` must exist in your SSH config.
- **OpenSSH Client**: The standard Windows OpenSSH client should be installed and available in the system path.

## Usage

To run the script, use the PowerShell call operator `&` from the workspace root or the scripts directory.

```powershell
& projects/MAGPIE_Server/scripts/pull_log.ps1 -Lvl server -From 20260701 -Del
```

### Examples

- **Pull all logs (no filtering)**:

  ```powershell
  & projects/MAGPIE_Server/scripts/pull_log.ps1
  ```

- **Pull specific log levels (e.g., error and console logs)**:

  ```powershell
  & projects/MAGPIE_Server/scripts/pull_log.ps1 -Lvl error,console
  ```

- **Pull logs starting from a specific date (inclusive)**:

  ```powershell
  & projects/MAGPIE_Server/scripts/pull_log.ps1 -From 20260601
  ```

- **Pull logs within a date range**:

  ```powershell
  & projects/MAGPIE_Server/scripts/pull_log.ps1 -From 20260601 -To 20260630
  ```

- **Pull server logs from a date range and delete them from the remote server**:

  ```powershell
  & projects/MAGPIE_Server/scripts/pull_log.ps1 -Lvl server -From 20260601 -To 20260630 -Del
  ```

- **Pull logs from a date range and delete them from the remote server without re-pulling them locally**:

  ```powershell
  & projects/MAGPIE_Server/scripts/pull_log.ps1 -From 20260601 -To 20260630 -DryRun -Del
  ```

- **Pull logs using custom directories and host**:

  ```powershell
  & projects/MAGPIE_Server/scripts/pull_log.ps1 -HostName "custom-gcp-host" -RemoteDir "~/custom_logs" -LocalDir "C:\custom_local_logs"
  ```

### Parameters

- `-Lvl`: (Optional, Aliases: `lvl`, `level`) An array of log levels to pull. Examples include `server`, `console`, `backup`, `error`, `exp`, or `governor_boot`.
- `-From`: (Optional, Alias: `from`) Pull logs starting from this date (inclusive) in `YYYYMMDD` format.
- `-To`: (Optional, Alias: `to`) Pull logs up to this date (inclusive) in `YYYYMMDD` format.
- `-Del`: (Switch, Alias: `del`) If present, successfully pulled remote logs will be deleted from the server to free up space.
- `-DryRun`: (Switch) If present, the script will identify matching files and mark them as "pulled" for the purpose of the `-Del` switch, but will skip the actual SCP transfer. Useful for remote-only cleanup.
- `-LocalDir`: (Optional) The local destination folder. Defaults to [tmp/MAGPIE_Server/logs](tmp/MAGPIE_Server/logs).
- `-RemoteDir`: (Optional) The remote logs directory path. Defaults to `~/MAGPIE_Server/logs`.
- `-HostName`: (Optional) The SSH target host name. Defaults to `magpie-gcp`.

## Features

- **Hanging Prevention**: Uses the `-n` and `-o BatchMode=yes` SSH options to ensure execution never blocks on standard input or interactive prompts during remote listing or deletion.
- **Intelligent Filtering**: Parses remote log names using the `^([a-zA-Z_]+)(\d{8})?\.log$` regex pattern to accurately separate levels from dates.
- **Robust Error Handling**: Captures and sanitizes GCP tunnel-specific error messages (like `stdin ReadFile failed` tracebacks) to provide a cleaner console output.
- **Activity Logging**: All operations, successes, and failures are appended to the local log file at [tmp/MAGPIE_Server/logs/pull_log.log](tmp/MAGPIE_Server/logs/pull_log.log).

## File References

- **Main Script**: [projects/MAGPIE_Server/scripts/pull_log.ps1](projects/MAGPIE_Server/scripts/pull_log.ps1)
- **Documentation**: [projects/MAGPIE_Server/scripts/pull_log_readme.md](projects/MAGPIE_Server/scripts/pull_log_readme.md)
- **Local Logs Directory**: [tmp/MAGPIE_Server/logs](tmp/MAGPIE_Server/logs)
- **Local Activity Log**: [tmp/MAGPIE_Server/logs/pull_log.log](tmp/MAGPIE_Server/logs/pull_log.log)
