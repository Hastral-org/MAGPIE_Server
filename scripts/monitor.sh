#!/bin/bash
# monitor.sh - High-density split dashboard for MAGPIE Server on e2-micro
# version 3

# Clear terminal completely on startup
clear

while true; do
    # Move cursor to top-left and clear screen
    printf "\033[2J\033[H"
    
    echo "=== MAGPIE SERVER DASHBOARD ==="
    echo "Timestamp: $(date)"
    echo "----------------------------------------------------------------"
    
    # 1. SYSTEM RAM HEALTH (Addresses Question 4)
    # Extracts free vs total memory directly from the OS efficiently
    echo "System Memory Status:"
    free -h | awk 'NR==2{printf "  Total: %s | Used: %s | Free: %s\n", $2, $3, $4}'
    echo "----------------------------------------------------------------"

    # 2. DETECT AND VERIFY RUNNING PROCESSES (Addresses Question 2)
    NODE_PID=$(pgrep -f "node.*SERVER.js")
    GOV_PID=$(pgrep -f "throttle_node.sh")
    LIMIT_PID=$(pgrep -f "cpulimit.*-p $NODE_PID" | head -n 1)

    echo "Active Process Matrix:"
    
    if [ -n "$NODE_PID" ]; then
        echo -e "  [ACTIVE] Node Engine  -> PID: $NODE_PID"
    else
        echo -e "  [OFFLINE] Node Engine -> Not running"
    fi

    if [ -n "$GOV_PID" ]; then
        echo -e "  [ACTIVE] Governor     -> PID: $GOV_PID"
    else
        echo -e "  [OFFLINE] Governor    -> Not running"
    fi

    if [ -n "$NODE_PID" ] && [ -n "$LIMIT_PID" ]; then
        echo -e "  [ACTIVE] CPU Throttler -> PID: $LIMIT_PID (Clamped to 20%)"
    elif [ -n "$NODE_PID" ] && [ -z "$LIMIT_PID" ]; then
        echo -e "  [WARNING] CPU Throttler -> NOT ATTACHED! App may cause GCP throttling."
    else
        echo -e "  [PASSIVE] CPU Throttler -> Waiting for Node..."
    fi
    
    echo "----------------------------------------------------------------"
    
    # 3. LIVE PROCESS METRICS (Addresses Question 1 by formatting cleanly)
    # Collects just the numerical percentages instead of raw messy text
    if [ -n "$NODE_PID" ]; then
        echo "Process Resource Usage:"
        # Grabs PID, %CPU, %MEM, and running Time for our specific PIDs
        PIDS_LIST=$(echo "$NODE_PID,$GOV_PID,$LIMIT_PID" | sed 's/,,/,/g' | sed 's/,$//' | sed 's/^,//')
        ps -p "$PIDS_LIST" -o pid,%cpu,%mem,time,comm 2>/dev/null
    else
        echo "No resource data: MAGPIE engine is idle."
    fi

    echo "----------------------------------------------------------------"
    
    # 4. LIVE LOG STREAM (Addresses Question 3)
    # Displays the last 8 lines of your boot log dynamically at the bottom
    echo "Recent Live Engine Logs:"
    if [ -f "/home/hamedahastral/MAGPIE_Server/logs/governor_boot.log" ]; then
        tail -n 8 "/home/hamedahastral/MAGPIE_Server/logs/governor_boot.log"
    else
        echo "  No governor log file discovered yet."
    fi

    echo "----------------------------------------------------------------"
    echo "Press Ctrl+C to stop monitoring"
    
    sleep 2
done
