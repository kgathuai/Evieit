# Multi-Platform Deployment Guide

Deploy Uni-Learn to **Samsung Tizen**, **LG webOS**, and **Android TV** from a single codebase.

---

## Quick Reference Table

| Platform | TV Brand | Installation | Offline | Complexity | Cost |
|----------|----------|--------------|---------|------------|------|
| **Tizen** | Samsung | Sideload via USB | Yes | Medium | Free (owns TV) |
| **webOS** | LG | Developer SDK | Yes | Medium | Free (owns TV) |
| **Android TV** | Google TV, Sony, TCL, Hisense, etc. | APK sideload or USB | Yes | Medium | Free (owns device) |
| **Raspberry Pi** | Any (HDMI) | SD card kiosk | Yes | Low | ~$50 |
| **Android TV Stick** | Any (HDMI) | APK sideload | Yes | Low | ~$30 |

---

## Build Your App Once

All platforms use the same React source (built with Vite). Build once:

```bash
npm install
npm run build
```

This creates the static `out/` folder used by all platforms.

---

## Platform 1: Samsung Tizen TVs

### Files
- Config: [tizen/config.xml](tizen/config.xml)
- Build script: [tizen/package-tizen.sh](tizen/package-tizen.sh)
- Docs: [tizen/README.md](tizen/README.md)

### Quick Deploy

```bash
chmod +x tizen/package-tizen.sh
./tizen/package-tizen.sh
```

Produces: `tizen/dist/UniLearnUSB-unsigned.wgt`

### Install on Samsung TV

1. Enable Developer Mode on TV
2. Install Tizen Studio
3. Create certificate profile
4. Sign the package:
   ```bash
   tizen package -t wgt -s <profile-name> -- tizen/.build
   ```
5. Connect TV:
   ```bash
   sdb connect <TV_IP>
   ```
6. Install:
   ```bash
   sdb install <signed-package>.wgt
   ```

**See [tizen/README.md](tizen/README.md) for full details.**

---

## Platform 2: LG webOS TVs

### Files
- Config: [webos/appinfo.json](webos/appinfo.json)
- Build script: [webos/package-webos.sh](webos/package-webos.sh)
- Docs: [webos/README.md](webos/README.md)

### Quick Deploy

```bash
chmod +x webos/package-webos.sh
./webos/package-webos.sh
```

Produces: `webos/dist/com.example.unilearn_0.1.0_all.ipk`

### Install on LG TV

1. Install webOS SDK
2. Enable Developer Mode on TV
3. Add TV to webOS CLI:
   ```bash
   webos-cli device add totolearn <TV_IP>
   ```
4. Install:
   ```bash
   webos-cli app install -d totolearn webos/dist/com.example.unilearn_0.1.0_all.ipk
   ```
5. Launch:
   ```bash
   webos-cli app launch -d totolearn com.example.unilearn
   ```

**See [webos/README.md](webos/README.md) for full details.**

---

## Platform 3: Android TV / Google TV

### Files
- Manifest: [android-tv/AndroidManifest.xml](android-tv/AndroidManifest.xml)
- Build guide: [android-tv/README.md](android-tv/README.md)

### Two Methods

#### Method A: Hosted URL (Easiest)

1. Build app: `npm run build`
2. Deploy `out/` to Netlify, Vercel, or GitHub Pages
3. Open URL on Android TV browser
4. Requires internet for playback

#### Method B: Offline APK (Recommended for Low-Income Users)

1. Install Android Studio
2. Create WebView app
3. Bundle built files:
   ```bash
   cp -r out/* android-tv/app/src/main/assets/
   ```
4. Build APK:
   ```bash
   cd android-tv && ./gradlew assembleRelease && cd ..
   ```
5. Sideload:
   ```bash
   adb connect <TV_IP>:5555
   adb install -r android-tv/app/build/outputs/apk/release/app-release.apk
   ```

**See [android-tv/README.md](android-tv/README.md) for full details.**

---

## Alternative: Raspberry Pi Kiosk (Works on All TVs)

### For TVs without native app support, use external hardware

- **Hardware:** Raspberry Pi 4 (2GB+) + microSD + HDMI cable
- **Cost:** ~$50–70
- **Works on:** Any TV with HDMI
- **Setup:** [pi-kiosk/README.md](pi-kiosk/README.md)

Deploy:
```bash
chmod +x pi-kiosk/setup.sh pi-kiosk/deploy.sh
pi-kiosk/deploy.sh pi@totolearn.local
```

---

## Alternative: Android TV Stick (Budget Option)

### Cheapest way to get TV app support

- **Hardware:** Android TV stick (Google TV) ~$20–30
- **Cost:** Cheaper than Raspberry Pi in many regions
- **Works on:** Any TV with HDMI
- **Setup:** Sideload APK via USB or ADB

Same APK as Android TV platform, deployed to the stick.

---

## Deployment Workflow (All Platforms)

### 1. Update App

Edit source code as usual (React + Vite).

### 2. Build

```bash
npm run build
```

### 3. Deploy to All Platforms

**Samsung Tizen:**
```bash
./tizen/package-tizen.sh
# Then sideload .wgt via Tizen Studio
```

**LG webOS:**
```bash
./webos/package-webos.sh
# Then install .ipk via webos-cli
```

**Android TV:**
```bash
cp -r out/* android-tv/app/src/main/assets/
cd android-tv && ./gradlew assembleRelease && cd ..
# Then sideload .apk via ADB or USB
```

**Raspberry Pi:**
```bash
pi-kiosk/deploy.sh pi@totolearn.local
```

---

## Input Handling (All Platforms)

All platforms use **D-pad navigation**:

- **Arrow Keys** (Up, Down, Left, Right) — navigate
- **OK / Enter** — select
- **Back** — return to menu
- **M** — toggle narration (web only)

Your app is already D-pad optimized in [app/page.jsx](app/page.jsx).

---

## Testing Checklist

Before shipping to families:

- [ ] Launch app after cold boot
- [ ] Navigate lessons with remote D-pad only
- [ ] Select items with OK button
- [ ] Go back with Back button
- [ ] Check audio plays correctly
- [ ] Verify progress saves locally
- [ ] Test on low connectivity / offline
- [ ] Confirm no internet required for core lessons

---

## Recommended Rollout Order

For low-income households:

1. **Primary:** Raspberry Pi kiosk (works on all TVs)
2. **Secondary:** Android TV APK (for devices with Android TV already)
3. **Tertiary:** Samsung Tizen (for families with Samsung TVs)
4. **Optional:** LG webOS (for families with LG TVs)

---

## FAQ

**Q: Which platform should I start with?**  
A: Raspberry Pi kiosk — it works on any TV, requires no platform-specific setup, and is most reliable for offline-first use.

**Q: Can I run one version on all TVs?**  
A: No single version works everywhere. Each TV brand has different requirements. Use the platform-specific packages or deploy via hardware (Pi/Android stick).

**Q: Do I need to sign/certificate these apps?**  
A: Yes for official distribution. For personal testing/deployment, sideload unsigned packages.

**Q: How do I update the app on deployed devices?**  
A: Re-run the deploy script (or reinstall APK) with updated `out/` folder.

**Q: Can I publish to app stores?**  
A: Yes, after signing. See "Publishing to Play Store" in [android-tv/README.md](android-tv/README.md).

---

## File Structure

```
.
├── tizen/                      # Samsung Tizen TV package
│   ├── config.xml
│   ├── package-tizen.sh
│   └── README.md
├── webos/                      # LG webOS TV package
│   ├── appinfo.json
│   ├── package-webos.sh
│   └── README.md
├── android-tv/                 # Android TV package
│   ├── AndroidManifest.xml
│   └── README.md
├── pi-kiosk/                   # Raspberry Pi HDMI kiosk
│   ├── setup.sh
│   ├── deploy.sh
│   └── README.md
├── package.json
├── next.config.mjs
└── DEPLOYMENT.md               # This file
```

---

## Support & Troubleshooting

For platform-specific issues, see:
- **Tizen:** [tizen/README.md](tizen/README.md)
- **webOS:** [webos/README.md](webos/README.md)
- **Android TV:** [android-tv/README.md](android-tv/README.md)
- **Raspberry Pi:** [pi-kiosk/README.md](pi-kiosk/README.md)
