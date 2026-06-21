do {
    # run server
    Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
    node --env-file=.env SERVER.js
    # capture exit code
    $exitCode = $LASTEXITCODE
    # decide what to do
    if($exitCode -eq 2)
    {
        Write-Host "--- Restart signal received CODE[2]: rebooting MAGPIE... ---" -ForegroundColor Cyan
    } 
    elseif($exitCode -eq 0)
    {
        Write-Host "--- Server shut down normally CODE[0]. Exiting loop. ---" -ForegroundColor Green
        break
    } else {
        Write-Host "--- Server crashed or stopped CODE[$exitCode]. ---" -ForegroundColor Red
        break
    }
} while ($exitCode -eq 2)