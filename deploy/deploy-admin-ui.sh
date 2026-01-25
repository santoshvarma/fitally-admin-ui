#!/bin/bash
set -e

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NGINX_DIR="/var/www/fitally-admin"

echo "🚀 Deploying FitAlly Admin Console"
echo "📁 App directory: $APP_DIR"

# 1. Go to repo root
cd "$APP_DIR"

# 2. Pull latest code
echo "📥 Pulling latest code"
git pull origin main

# 3. Install dependencies
echo "📦 Installing dependencies"
npm install

# 4. Build admin UI
echo "🏗️ Building admin UI"
npm run build

# 5. Clean old build
echo "🧹 Cleaning old NGINX directory"
rm -rf "$NGINX_DIR"/*

# 6. Copy new build
echo "📂 Copying new build to NGINX"
cp -r dist/* "$NGINX_DIR"/

# 7. Reload NGINX
echo "🔁 Reloading NGINX"
sudo systemctl reload nginx

echo "✅ Admin Console deployed successfully"
