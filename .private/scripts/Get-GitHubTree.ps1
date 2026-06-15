<#
.SYNOPSIS
    Generates a clean ASCII/Unicode file directory tree optimized for GitHub Markdown.

.DESCRIPTION
    This script traverses directories and outputs a structured visual tree using 
    standard Unicode branch markers (├── and └──). It is highly optimized for GitHub 
    Markdown code blocks and includes parameter validation to protect terminal memory.

.PARAMETER Path
    The target directory to map out. Defaults to the current folder (".").
    Must be a valid, existing directory path on the system.

.PARAMETER Exclude
    An array of folder or file names to completely ignore during the crawl. 
    Defaults to common framework/system clutter: node_modules, .git, etc.

.PARAMETER MaxDepth
    The maximum level of folder nesting allowed. 
    Must be an integer between 1 and 5. Default is 5.

.PARAMETER MaxLines
    Caps the total number of printed lines to prevent terminal flooding or markdown lag.
    Must be an integer between 10 and 500. Default is 100.

.PARAMETER Format
    Determines the layout style of the output branches.
    - Unicode: Beautiful modern lines (├──, └──, │)
    - ASCII: Safe, basic retro characters (+---, \---, |) for legacy systems.

.PARAMETER CopyToClipboard
    A switch flag. If provided, suppresses screen output and copies the resulting 
    string directly to your Windows clipboard.

.EXAMPLE
    Get-GitHubTree -MaxDepth 2 -Format ASCII
    Generates a legacy ASCII tree capped strictly at 2 levels of folder depth.

.EXAMPLE
    Get-GitHubTree -Format Unicode -MaxLines 50 -CopyToClipboard
    Generates a modern Unicode tree up to 50 lines max and copies it straight to the clipboard.
#>
function Get-GitHubTree {
    [CmdletBinding()]
    param(
        # 1. Path must actually exist on the computer
        [Parameter(Position = 0)]
        [ValidateScript({ Test-Path $_ -PathType Container })]
        [string]$Path = ".",

        # 2. Exclude array filters common noise by default
        [string[]]$Exclude = @("node_modules", ".git", ".github", "bin", "obj", "dist", "__pycache__"),

        # 3. Restrict depth to a safe range (1 to 5 levels) to prevent deep loop crashes
        [ValidateRange(1, 5)]
        [int]$MaxDepth = 5,

        # 4. Restrict lines to a safe volume (10 to 500 lines) for markdown efficiency
        [ValidateRange(10, 500)]
        [int]$MaxLines = 100,

        # 5. Tab-Completion Restriction: Tab key will cycle ONLY between these two strings
        [ValidateSet("Unicode", "ASCII")]
        [string]$Format = "Unicode",

        # 6. Clipboard action switch
        [switch]$CopyToClipboard
    )

    function Show-Tree {
        param([string]$CurrentPath, [string]$Indent, [int]$CurrentDepth)
        
        # Enforce max depth constraint
        if ($CurrentDepth -gt $MaxDepth) { return }

        # Fetch child items and filter out any names explicitly excluded
        $Items = Get-ChildItem -Path $CurrentPath | Where-Object { $_.Name -notin $Exclude }
        $Count = $Items.Count

        for ($i = 0; $i -lt $Count; $i++) {
            # Enforce line cap constraint
            if ($script:LineCount -ge $MaxLines) {
                if (-not $script:CappedMessageShown) {
                    $script:Output += "$Indent... [Output capped at $MaxLines lines] ..."
                    $script:CappedMessageShown = $true
                }
                return
            }

            $Item = $Items[$i]
            $IsLast = ($i -eq $Count - 1)
            
            # Select markers based on user's Format choice
            if ($Format -eq "Unicode") {
                $Marker = if ($IsLast) { "└── " } else { "├── " }
                $Pipe   = "│   "
            } else {
                $Marker = if ($IsLast) { "\--- " } else { "+--- " }
                $Pipe   = "|   "
            }

            $script:Output += "$Indent$Marker$($Item.Name)"
            $script:LineCount++

            # If it's a directory, recursively descend
            if ($Item.PSIsContainer) {
                $NextIndent = $Indent + (if ($IsLast) { "    " } else { $Pipe })
                Show-Tree -CurrentPath $Item.FullName -Indent $NextIndent -CurrentDepth ($CurrentDepth + 1)
            }
        }
    }

    # Track multi-level recursive state
    $script:Output = @()
    $script:LineCount = 0
    $script:CappedMessageShown = $false

    # Append Root directory name
    $script:Output += (Get-Item $Path).Name
    
    # Run the crawler
    Show-Tree -Path $Path -Indent "" -CurrentDepth 1

    $FinalResult = $script:Output -join "`r`n"

    # Direct output to screen or system memory clipboard
    if ($CopyToClipboard) {
        $FinalResult | Set-Clipboard
        Write-Host "Success: Tree copied to clipboard!" -ForegroundColor Green
    } else {
        return $FinalResult
    }
}
