<#
.SYNOPSIS
    Syncs local SQLite database (dev.db) into remote Supabase PostgreSQL.

.DESCRIPTION
    Transfers all 17,258 records (Users, Stores, Products, Orders, Wallets, PayAI)
    from local SQLite to your Supabase PostgreSQL instance in foreign key order.

.PARAMETER DatabaseUrl
    Supabase PostgreSQL connection string (Transaction pooler on port 6543 or session on 5432).

.PARAMETER DryRun
    Preview records to be migrated without modifying the remote database.

.PARAMETER VerboseOutput
    Enable detailed logging for every table and chunk.

.EXAMPLE
    .\scripts\sync-to-supabase.ps1 -DryRun
    .\scripts\sync-to-supabase.ps1 "postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
#>

[CmdletBinding()]
param(
    [Parameter(Position=0, Mandatory=$false)]
    [string]$DatabaseUrl = "",

    [Parameter(Mandatory=$false)]
    [switch]$DryRun,

    [Parameter(Mandatory=$false)]
    [switch]$VerboseOutput,

    [Parameter(Mandatory=$false)]
    [switch]$Help
)

$ErrorActionPreference = "Stop"

if ($Help) {
    Write-Host @"
======================================================
  W-COMMERCE: SYNC LOCAL SQLITE TO SUPABASE (POWERSHELL)
======================================================
Usage:
  .\scripts\sync-to-supabase.ps1 [SUPABASE_URL] [-DryRun] [-VerboseOutput]

Examples:
  # Preview what will be migrated without making changes:
  .\scripts\sync-to-supabase.ps1 -DryRun

  # Run live migration to Supabase:
  .\scripts\sync-to-supabase.ps1 "postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

  # Or set TARGET_DATABASE_URL / DATABASE_URL in .env.production and run:
  .\scripts\sync-to-supabase.ps1
"@
    exit 0
}

Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "   W-COMMERCE: SUPABASE DATABASE SYNC HELPER          " -ForegroundColor Cyan
Write-Host "======================================================`n" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
$sqliteDb = Join-Path $rootDir "database\prisma\dev.db"

if (-not (Test-Path $sqliteDb)) {
    Write-Host "❌ SQLite source database dev.db not found at: $sqliteDb" -ForegroundColor Red
    exit 1
}

# Resolve target URL if not provided via parameter
if (-not $DatabaseUrl) {
    if ($env:TARGET_DATABASE_URL) { $DatabaseUrl = $env:TARGET_DATABASE_URL }
    elseif ($env:SUPABASE_DATABASE_URL) { $DatabaseUrl = $env:SUPABASE_DATABASE_URL }
    elseif ($env:DIRECT_URL -and ($env:DIRECT_URL -like "postgres*")) { $DatabaseUrl = $env:DIRECT_URL }
    elseif ($env:DATABASE_URL -and ($env:DATABASE_URL -like "postgres*") -and ($env:DATABASE_URL -notmatch "USER:PASSWORD|DB_USER|placeholder")) {
        $DatabaseUrl = $env:DATABASE_URL
    }
}

# Check .env.production and .env if still empty
if (-not $DatabaseUrl) {
    $envFiles = @(
        (Join-Path $rootDir ".env.production"),
        (Join-Path $rootDir ".env"),
        (Join-Path $rootDir "backend\.env")
    )
    foreach ($file in $envFiles) {
        if (Test-Path $file) {
            $lines = Get-Content $file
            foreach ($line in $lines) {
                if ($line -match '^(?:TARGET_DATABASE_URL|SUPABASE_DATABASE_URL|DATABASE_URL)\s*=\s*["'']?(postgres(?:ql)?:\/\/[^"''\r\n]+)["'']?') {
                    $matched = $matches[1]
                    if ($matched -notmatch "USER:PASSWORD|DB_USER|placeholder") {
                        $DatabaseUrl = $matched
                        break
                    }
                }
            }
            if ($DatabaseUrl) { break }
        }
    }
}

# If still no URL and not in DryRun mode, prompt the user interactively
if (-not $DatabaseUrl -and -not $DryRun) {
    Write-Host "No Supabase PostgreSQL URL found in environment or .env files." -ForegroundColor Yellow
    Write-Host "You can find your connection string in Supabase Dashboard -> Project Settings -> Database -> Connection String (URI)." -ForegroundColor Yellow
    Write-Host ""
    $inputUrl = Read-Host "Paste your Supabase connection string (or press Enter for DryRun preview)"
    if ($inputUrl) {
        $DatabaseUrl = $inputUrl.Trim().Trim('"').Trim("'")
    } else {
        $DryRun = $true
    }
}

# Build arguments for seed-from-sqlite.cjs
$nodeArgs = @((Join-Path $rootDir "scripts\seed-from-sqlite.cjs"))

if ($DryRun) {
    $nodeArgs += "--dry-run"
}
if ($VerboseOutput) {
    $nodeArgs += "--verbose"
}
if ($DatabaseUrl) {
    $nodeArgs += $DatabaseUrl
}

Write-Host "Executing migration engine..." -ForegroundColor Green
& node @nodeArgs
