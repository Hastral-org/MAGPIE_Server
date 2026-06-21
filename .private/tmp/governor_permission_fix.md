---
repo: Hastral-org/MAGPIE_Server
issue: 113
---

# Issue: MAGPIE Governor (throttle_node.sh) Failing to Start

## Overview

The `throttle_node.sh` script, designed to limit the CPU usage of the MAGPIE server on GCP e2-micro instances, was not executing despite being called by the `start.sh` boot script. This left the server without CPU throttling, risking instance instability or termination due to resource exhaustion.

## Root Cause

The script `throttle_node.sh` lacked the **executable bit** in its file permissions. In Linux, having a shebang (`#!/bin/bash`) is not sufficient; the file system metadata must explicitly mark the file as executable for `nohup` or direct execution to work. This resulted in "Permission denied" errors in the boot logs.

## Immediate Fix

Grant execution permissions to the governor script using the `chmod` command:

```bash
chmod +x /home/hamedahastral/MAGPIE_Server/scripts/throttle_node.sh
```

After applying the permission, restart the server:

```bash
./start.sh
```

## Prevention Tips

1. **Git Permissions**: Ensure that shell scripts are committed to the repository with executable permissions. You can set this in git using:
   `git update-index --chmod=+x scripts/throttle_node.sh`
2. **Deployment Checklists**: Add a "Permissions Audit" step to the deployment pipeline to verify that all `.sh` files in the `scripts/` directory are executable.
3. **Boot Log Monitoring**: Regularly check the `governor_boot.log` (or equivalent) during initial deployment to catch `Permission denied` errors early.
