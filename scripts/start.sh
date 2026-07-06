#!/bin/bash
# start.sh v3 (Optimized for GCP e2-micro with Enhanced Logging)

export NODE_ENV=production

# Logging function matching throttle_node formatting
log_msg() {
    local level="$1"
    local color="$2"
    local message="$3"
    # Prints formatted string, preserving bash color codes for terminal output
    echo -e "[$(date +'%Y%m%d%H%M%S')] [$level] ${color}${message}\e[0m"
}

# 1. Zombie Cleanup: Ensure no orphaned node or cpulimit processes are lingering
log_msg "ENGINE" "\e[33m" "Cleaning up zombie processes..."
pkill -f "node.*SERVER.js" 2>/dev/null
pkill -f "cpulimit" 2>/dev/null
sleep 1

# 2. Start Governor loop with nohup to fully isolate it from this script's process space
if ! pgrep -f "throttle_node.sh" > /dev/null; then
    nohup /home/hamedahastral/MAGPIE_Server/scripts/throttle_node.sh 2>&1 | ts '[%Y%m%d%H%M%S]' >> /home/hamedahastral/MAGPIE_Server/logs/governor_boot.log &
fi

/usr/bin/find /tmp -type f -mtime +3 -delete 2>/dev/null

log_msg "ENGINE" "\e[32m" "System environments verified. Booting MAGPIE Engine..."

while true; do
    node --env-file=.env --max-old-space-size=512 SERVER.js
    exitCode=$?
    
    if [ "$exitCode" -eq 2 ]; then
        log_msg "ENGINE" "\e[36m" "Restart signal received CODE[2]: rebooting MAGPIE..."
        sleep 2
    elif [ "$exitCode" -eq 0 ]; then
        log_msg "ENGINE" "\e[32m" "Server shut down normally CODE[0]. Exiting loop."
        break
    else
        # CRASH PROTECTION: Rest 10 seconds before restarting to prevent high-CPU crash looping
        log_msg "ENGINE" "\e[31m" "Server crashed CODE[$exitCode]. cooling down 10s before auto-reboot..."
        sleep 10
    fi
done
