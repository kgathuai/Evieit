# LG webOS TV Deployment

This folder packages Uni-Learn for **LG webOS TV** (native LG app installation).

## Requirements

- LG TV with webOS 3.0 or later
- LG Developers account (create at [lg.com/developer](https://lg.com/developer))
- webOS SDK installed on your Mac
- Access to TV for developer mode

## 1) Install webOS SDK

Download from [LG Developer Site](https://developer.lge.com/webos-tv/):

```bash
# Install via brew (if available) or direct download
brew install lge-webos-sdk
```

Or download manually and add to PATH.

## 2) Set up the app structure

```bash
# From project root
npm run build

# Create webOS app directory
mkdir -p webos/.build
cp -r out/* webos/.build/

# Copy icon (create a 480x480 PNG icon.png or use placeholder)
# cp your-icon.png webos/icon.png
```

## 3) Build the webOS package

```bash
chmod +x webos/package-webos.sh
./webos/package-webos.sh
```

Output: `webos/dist/com.example.unilearn_0.1.0_all.ipk`

## 4) Enable Developer Mode on TV

1. On TV, go to **Settings → All Settings → Developer**.
2. Enable **Developer Mode**.
3. Note the TV's IP address.

## 5) Connect and Deploy

```bash
# Connect to TV (replace 192.168.1.100 with your TV IP)
webos-cli device add totolearn 192.168.1.100

# Install app
webos-cli app install -d totolearn webos/dist/com.example.unilearn_0.1.0_all.ipk

# Launch app
webos-cli app launch -d totolearn com.example.unilearn
```

## 6) Verify Installation

1. On TV home screen, find "Uni-Learn" in apps list.
2. Select and launch.
3. Use TV remote: arrow keys, OK/Enter, Back button.

## Troubleshooting

- **SDK not found**: Add webOS SDK to PATH:
  ```bash
  export PATH="/opt/webostv-sdk/bin:$PATH"
  ```
- **Connection refused**: Verify TV IP, enable Developer Mode, same network.
- **App won't launch**: Check TV logs with `webos-cli device log -d totolearn`.

## Notes

- App runs completely offline after installation.
- All assets (lessons, images, audio) bundled inside the app.
- Progress saved to TV's local storage.
- No account or internet required for core features.

## Update Workflow

To deploy a new version:

```bash
npm run build
cp -r out/* webos/.build/
./webos/package-webos.sh
webos-cli app install -d totolearn webos/dist/com.example.unilearn_0.1.0_all.ipk
```
