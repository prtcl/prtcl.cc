#!/bin/zsh
set -e

# Load deployment vars from .env.production
if [ ! -f .env.production ]; then
  echo "Error: .env.production not found"
  exit 1
fi

set -a
source <(grep -E '^VPS_' .env.production)
set +a

# Required environment variables:
# VPS_HOST - hostname or IP of your VPS (e.g., "prtcl.cc")
# VPS_USER - SSH user (e.g., "cory")
# VPS_PATH - path to static files on VPS (e.g., /var/www/prtcl.cc)

: "${VPS_HOST:?VPS_HOST environment variable is required}"
: "${VPS_USER:?VPS_USER environment variable is required}"
: "${VPS_PATH:?VPS_PATH environment variable is required}"

echo "Building locally..."
npm run clean
npm ci
npx convex deploy --cmd 'npm run build' --yes

echo ""
echo "Syncing dist..."
rsync -avz --progress --delete dist/ "${VPS_USER}@${VPS_HOST}:${VPS_PATH}/"

echo ""
echo "Done"
