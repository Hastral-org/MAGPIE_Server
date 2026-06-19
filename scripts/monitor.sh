#!/bin/bash
# monitor.sh - Resource monitoring loop for MAGPIE Server
# Uses cursor positioning to eliminate terminal flashing

# Clear once at the very start of the script
clear

while true; do
    # Move cursor to top-left corner and clear from cursor to end of screen
    printf "\033[H\033[J"
    
    echo "=== MAGPIE RESOURCE MONITOR ==="
    echo "Timestamp: $(date)"
    echo "----------------------------------------------------------------"
    
    # Grab active PIDs
    PIDS=$(pgrep -f "node.*SERVER.js|cpulimit|throttle_node.sh" | paste -sd, -)
    
    if [ ! -z "$PIDS" ]; then
        # Run top in batch mode (-b) to prevent interactive redraw artifacts
        top -p "$PIDS" -b -n 1
    else
        echo "No active MAGPIE processes found. Monitoring...             "
        # Clear out a few lines below so old data doesn't linger
        printf "\n\n\n\n\n"
    fi
    
    echo "----------------------------------------------------------------"
    echo "Press Ctrl+C to exit"
    
    sleep 2
done
