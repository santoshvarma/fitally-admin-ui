#!/usr/bin/env bash
set -euo pipefail

# -------- PATHS --------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DIST_DIR="$APP_DIR/dist"
ENV_FILE="$APP_DIR/.env"

SERVER_DIR="/var/www/fitally-admin"
SSH_KEY="$HOME/.ssh/ssh-key-2026-01-15.key"
# -----------------------

echo "🚀 Building and Deploying FitAlly Admin UI"

# 1️⃣ Load .env file
if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ ERROR: .env file not found at $ENV_FILE"
  exit 1
fi

echo "📄 Loading environment variables"
export $(grep -v '^#' "$ENV_FILE" | xargs)

REMOTE_USER="${ORACLE_VM_USER:-}"
REMOTE_HOST="${ORACLE_VM_IP:-}"

if [[ -z "$REMOTE_USER" ]]; then
  echo "❌ ERROR: ORACLE_VM_USER not found in .env"
  exit 1
fi

if [[ -z "$REMOTE_HOST" ]]; then
  echo "❌ ERROR: ORACLE_VM_IP not found in .env"
  exit 1
fi

SSH="${REMOTE_USER}@${REMOTE_HOST}"
echo "🌐 Server: $SSH"

# 2️⃣ Go to app root
cd "$APP_DIR"

# 3️⃣ Build locally
echo "🔨 Running production build locally"
npm run build

if [[ ! -d "$DIST_DIR" ]]; then
  echo "❌ ERROR: Build failed — dist folder not created"
  exit 1
fi

# 4️⃣ Clean server directory
echo "🧹 Cleaning server directory"
ssh -i "$SSH_KEY" "$SSH" "sudo rm -rf ${SERVER_DIR}/*"

# 5️⃣ Upload dist to server
echo "📦 Uploading dist to server"
scp -i "$SSH_KEY" -r "$DIST_DIR/"* "${SSH}:${SERVER_DIR}/"

# 6️⃣ Reload NGINX
echo "🔄 Reloading NGINX"
ssh -i "$SSH_KEY" "$SSH" "sudo systemctl reload nginx"

echo "🎉 Build and deployment completed successfully"