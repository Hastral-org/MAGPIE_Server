---
type: guide
topic: gcp-instance
author: Matheraptor
---

# Managing my GCP instance {#top}

- [Managing my GCP instance {#top}](#managing-my-gcp-instance-top)
  - [Overview](#overview)
    - [Dashboards \& System Performance](#dashboards--system-performance)
      - [`top`](#top)
      - [`ps`](#ps)
      - [free -h](#free--h)
    - [Process Identification \& Control](#process-identification--control)
      - [`pgrep`](#pgrep)
      - [`pkill`](#pkill)
      - [`kill -0 <PID>`](#kill--0-pid)
      - [`nohup`](#nohup)
    - [Permissions \& Navigation](#permissions--navigation)
    - [Text Processing \& Logs](#text-processing--logs)
    - [Advanced Monitoring Packages](#advanced-monitoring-packages)
  - [Administration](#administration)
  - [Diagnostics](#diagnostics)
  - [Health](#health)
    - [Update](#update)
  - [Monitoring](#monitoring)

---

## Overview

### Dashboards & System Performance

#### `top`

Displays real-time system resource consumption (CPU, RAM, active tasks).

```bash
# runs it in batch mode for specified PIDs so it 
# doesnt flicker or lock up your terminal.
top -p "$PIDS" -b -n 1
```

#### `ps`

Captures a static snapshot of current active processes.Usage in your script:

```bash
ps -p "$PIDS" -o pid,%cpu,%mem,time,comm 
# extracts only the exact columns you need for clean styling.
```

#### free -h

Displays total, used, and available system RAM in human-readable format (G or M).

### Process Identification & Control

#### `pgrep`

Searches for active processes by name and returns their PIDs (Process IDs):

```bash
pgrep -f "node.*SERVER.js"
# uses the -f flag to match the full execution path, not just the base command name.
```

#### `pkill`

Finds and immediately kills running processes by matching their names:

```bash
pkill -f "cpulimit"
# forces all running throttlers to close.
```

#### `kill -0 <PID>`

Checks if a specific process is still alive without actually stopping it.

#### `nohup`

Runs a command in the background detached from your current terminal window. If you close your terminal or log out, the script keeps running.

### Permissions & Navigation

```bash
chmod +x ./scripts/monitor.sh
```

Grants "execute" permissions to your script so you can launch it using:

```bash
./.ls -l
# Lists files in the current folder along with their ownership, size, and read/write/execute permissions.
which <command>
# Searches your system directories to show you the absolute path where a tool is installed (e.g., which cpulimit outputs /usr/bin/cpulimit).
pwd
# Prints the absolute path of your current working directory.
```

### Text Processing & Logs

```bash
tail -n 8 <file>
# Outputs the final 8 lines of a text or log file.
grep
# Filters text lines matching a specific pattern.
grep -v "$$" 
# filters out the current monitor script's PID to prevent a false positive loop match.
paste -sd, -
# Blends multiple rows of text output into a single line, separated by commas (e.g., turning three PID lines into 123,456,789).
```

### Advanced Monitoring Packages

```bash
sudo apt install moreutils
# Installs a suite of lightweight Unix administration tools.
ts '[%Y%m%d%H%M%S]'
# The specialized time-stamping tool inside moreutils that intercepts terminal text output and injects real-time stamps onto every line.
```

[Back to top ⤴️](#top)

---

## Administration

- Reboot:

  ```bash
  sudo reboot
  ```

- hard reboot:

  ```bash
  sudo reboot -f
  ```

[Back to top ⤴️](#top)

## Diagnostics

[Back to top ⤴️](#top)

---

## Health

[Back to top ⤴️](#top)

---

### Update

[Back to top ⤴️](#top)

---

## Monitoring

- Authentication log (for failures or invalid attempts):

  ```bash
  tail /var/log/auth.log
  ```

- CPU monitor (real-time `top` process monitoring):

  ```bash
  

[Back to top ⤴️](#top)

---
