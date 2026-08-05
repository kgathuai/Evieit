#!/usr/bin/env bash
# Run this ON the Raspberry Pi (via SSH), once, after a fresh Raspberry Pi
# OS (Legacy/Bullseye, Desktop) install. See pi-kiosk/README.md for the
# full walkthrough — this script only handles the parts safe to automate;
# desktop autologin is a separate manual `raspi-config` step.
set -euo pipefail

APP_DIR="$HOME/totolearn"
PORT=8080

echo "==> Installing Chromium + unclutter"
sudo apt-get update
sudo apt-get install -y --no-install-recommends chromium-browser unclutter

echo "==> Creating app directory at $APP_DIR (deploy.sh fills out/ later)"
mkdir -p "$APP_DIR/out"

echo "==> Installing systemd service to serve the app on localhost:$PORT"
sudo tee /etc/systemd/system/totolearn-server.service > /dev/null <<EOF
[Unit]
Description=Uni-Learn static file server
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR/out
ExecStart=/usr/bin/python3 -m http.server $PORT
Restart=always
User=$USER

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now totolearn-server

echo "==> Configuring kiosk autostart (Chromium fullscreen, no screensaver)"
AUTOSTART_DIR="$HOME/.config/lxsession/LXDE-pi"
mkdir -p "$AUTOSTART_DIR"
AUTOSTART_FILE="$AUTOSTART_DIR/autostart"

# Start from the LXDE default if this is the first customization, then
# append our kiosk lines (idempotent — skips if already present).
if [ ! -f "$AUTOSTART_FILE" ] && [ -f /etc/xdg/lxsession/LXDE-pi/autostart ]; then
  cp /etc/xdg/lxsession/LXDE-pi/autostart "$AUTOSTART_FILE"
fi
touch "$AUTOSTART_FILE"

add_line() {
  grep -qxF "$1" "$AUTOSTART_FILE" || echo "$1" >> "$AUTOSTART_FILE"
}

add_line "@xset s off"
add_line "@xset -dpms"
add_line "@xset s noblank"
add_line "@unclutter -idle 0.5 -root"
add_line "@chromium-browser --kiosk --noerrdialogs --disable-infobars --disable-session-crashed-bubble --disable-translate --no-first-run --check-for-update-interval=31536000 --autoplay-policy=no-user-gesture-required http://localhost:$PORT"

echo "==> Done."
echo ""
echo "Next steps:"
echo "  1. Run 'sudo raspi-config' -> System Options -> Boot / Auto Login -> Desktop Autologin"
echo "  2. From your Mac: pi-kiosk/deploy.sh $USER@\$(hostname).local"
echo "  3. sudo reboot"
