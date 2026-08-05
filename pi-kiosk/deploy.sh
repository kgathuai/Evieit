#!/usr/bin/env bash
# Run this on your Mac (dev machine), not the Pi. Builds the static export
# and syncs it to a Pi already provisioned by pi-kiosk/setup.sh.
#
# Usage: pi-kiosk/deploy.sh pi@totolearn.local
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <user@host>" >&2
  echo "Example: $0 pi@totolearn.local" >&2
  exit 1
fi

PI_HOST="$1"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Building static export"
cd "$ROOT_DIR"
npm run build

echo "==> Syncing out/ to $PI_HOST:~/totolearn/out/"
rsync -av --delete "$ROOT_DIR/out/" "$PI_HOST:~/totolearn/out/"

echo "==> Restarting the Pi's server"
ssh "$PI_HOST" 'sudo systemctl restart totolearn-server'

echo "==> Done. Chromium on the Pi will show the update on its next reload/reboot."
