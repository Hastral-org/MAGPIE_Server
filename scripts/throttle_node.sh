#!/bin/bash
# throttle_node v8 (Fixed for GCP e2-micro with Enhanced Logging)

# Prevent multiple instances
if [ $(pgrep -f "$(basename "$0")" | wc -l) -gt 2 ]; then
    exit 0
fi

cd /home/hamedahastral/MAGPIE_Server
CPU_LIMIT=20  
CPULIMIT_PID=""

# Logging function for clean, standardized output
log_msg() {
    local level="$1"
    local message="$2"
    echo "[$level] $message"
}

log_msg "THROTTLER" "Passive MAGPIE Governor v8 loaded. Waiting for manual node start..."

while true; do
    NODE_PID=$(pgrep -f "node.*SERVER.js")

    if [ ! -z "$NODE_PID" ]; then
        # Check if cpulimit needs to be spawned or restarted
        if [ -z "$CPULIMIT_PID" ] || ! kill -0 "$CPULIMIT_PID" 2>/dev/null; then
            
            pkill -f "cpulimit" 2>/dev/null

            log_msg "THROTTLER" "Manual Node process detected (PID: $NODE_PID). Applying ${CPU_LIMIT}% CPU throttle..."
            
            /usr/bin/cpulimit -p "$NODE_PID" -l "$CPU_LIMIT" -b
            sleep 0.5
            CPULIMIT_PID=$(pgrep -f "cpulimit.*-p $NODE_PID")
        fi
    else
        # Clean up if Node stops
        if [ ! -z "$CPULIMIT_PID" ]; then
            log_msg "THROTTLER" "Node stopped. Cleaning up cpulimit..."
            pkill -f "cpulimit" 2>/dev/null
            CPULIMIT_PID=""
        fi
    fi

    sleep 5 
done
