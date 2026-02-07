$ErrorActionPreference = "Stop"

# -------- PATHS --------
$APP_DIR  = Resolve-Path "$PSScriptRoot\.."
$DIST_DIR = Join-Path $APP_DIR "dist"
$ENV_FILE = Join-Path $APP_DIR ".env"

$SERVER_DIR = "/var/www/fitally-admin"
$SSH_KEY    = "$HOME/.ssh/ssh-key-2026-01-15.key"
# -----------------------

Write-Host "Building and Deploying FitAlly Admin UI"

# 1. Load .env file
if (-not (Test-Path $ENV_FILE)) {
    throw ".env file not found at $ENV_FILE"
}

Get-Content $ENV_FILE | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
    $parts = $_ -split '=', 2
    Set-Variable -Name $parts[0].Trim() -Value $parts[1].Trim()
}

if (-not $ORACLE_VM_IP) {
    throw "ORACLE_VM_IP not found in .env"
}
if (-not $ORACLE_VM_USER) {
    throw "ORACLE_VM_USER not found in .env"
}

$SSH = "$ORACLE_VM_USER@$ORACLE_VM_IP"
Write-Host "Server: $SSH"

# 2. Go to app root
Set-Location $APP_DIR

# 3. Build locally
Write-Host "Running production build locally"
npm run build

if (-not (Test-Path $DIST_DIR)) {
    throw "Build failed: dist folder not created"
}

# 4. Clean server directory
Write-Host "Cleaning server directory"
ssh -i $SSH_KEY $SSH "sudo rm -rf ${SERVER_DIR}/*"

# 5. Upload dist to server
Write-Host "Uploading dist to server"
scp -i $SSH_KEY -r "$DIST_DIR/*" "${SSH}:${SERVER_DIR}/"

# 6. Reload NGINX
Write-Host "Reloading NGINX"
ssh -i $SSH_KEY $SSH "sudo systemctl reload nginx"

Write-Host "Build and deployment completed successfully"
