#!/bin/bash
# start.sh v2 (Optimized for GCP e2-micro)

export NODE_ENV=production

# 1. Zombie Cleanup: Ensure no orphaned node or cpulimit processes are lingering
echo -e "\e[33m--- Cleaning up zombie processes... ---\e[0m"
pkill -f "node.*SERVER.js" 2>/dev/null
pkill -f "cpulimit" 2>/dev/null
sleep 1

# 2. Start Governor loop with nohup to fully isolate it from this script's process space
if ! pgrep -f "throttle_node.sh" > /dev/null; then
    nohup /home/hamedahastral/MAGPIE_Server/scripts/throttle_node.sh >> /home/hamedahastral/MAGPIE_Server/logs/governor_boot.log 2>&1 &
fi

/usr/bin/find /tmp -type f -mtime +3 -delete 2>/dev/null

echo -e "\e[32m--- System environments verified. Booting MAGPIE Engine... ---\e[0m"

while true; do
    node --env-file=.env --max-old-space-size=512 SERVER.js
    exitCode=$?
    
    if [ "$exitCode" -eq 2 ]; then
        echo -e "\e[36m--- Restart signal received CODE[2]: rebooting MAGPIE... ---\e[0m"
        sleep 2
    elif [ "$exitCode" -eq 0 ]; then
        echo -e "\e[32m--- Server shut down normally CODE[0]. Exiting loop. ---\e[0m"
        break
    else
        # CRASH PROTECTION: Rest 10 seconds before restarting to prevent high-CPU crash looping
        echo -e "\e[31m--- Server crashed CODE[$exitCode]. cooling down 10s before auto-reboot... ---\e[0m"
        sleep 10
    fi
done
