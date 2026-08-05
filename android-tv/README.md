# Android TV / Google TV Deployment

This folder packages Uni-Learn for **Android TV** and **Google TV** sticks and TVs (Sony, TCL, Hisense, Xiaomi, etc.).

## Supported Devices

- Google TV devices (Chromecast with Google TV, etc.)
- Android TV boxes and dongles
- Sony, TCL, Hisense, and other Android-based TVs
- Amazon Fire TV (with modifications)

## Two Deployment Methods

### Method 1: Hosted URL (Easiest, Online Required)

1. Build static export:
   ```bash
   npm run build
   ```

2. Deploy `out/` folder to free static host:
   - Netlify
   - Vercel
   - Cloudflare Pages
   - GitHub Pages

3. On Android TV stick:
   - Install "TV Bro" or similar browser
   - Open your hosted URL
   - Bookmark as Home

**Pros:** No coding, works immediately  
**Cons:** Requires internet after initial setup

---

### Method 2: Offline APK (Recommended for Low-Income Users)

Build a self-contained Android app that includes all lessons and runs completely offline.

## Prerequisites

- Android SDK (or Android Studio)
- Node.js and npm
- Gradle

## Quick Setup (Using Android Studio)

1. **Install Android Studio** from [developer.android.com](https://developer.android.com/studio)

2. **Create a simple WebView app:**
   - Open Android Studio → New Project
   - Choose "Empty Views Activity"
   - Name: `UniLearnTV`
   - Package: `com.example.unilearn`
   - Minimum API: 21 (Android 5.0)

3. **Build your static assets:**
   ```bash
   npm run build
   ```

4. **Add assets to Android project:**
   ```bash
   # Copy built files to Android assets
   cp -r out/* android-tv/app/src/main/assets/
   ```

5. **Create MainActivity.java** (WebView shell):

   ```java
   package com.example.unilearn;

   import android.os.Bundle;
   import android.webkit.WebSettings;
   import android.webkit.WebView;
   import android.view.KeyEvent;
   import androidx.appcompat.app.AppCompatActivity;

   public class MainActivity extends AppCompatActivity {
       private WebView webView;

       @Override
       protected void onCreate(Bundle savedInstanceState) {
           super.onCreate(savedInstanceState);
           setContentView(R.layout.activity_main);

           webView = findViewById(R.id.webview);
           WebSettings settings = webView.getSettings();
           settings.setJavaScriptEnabled(true);
           settings.setDomStorageEnabled(true);
           settings.setDatabaseEnabled(true);
           settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

           // Load local HTML
           webView.loadUrl("file:///android_asset/index.html");
       }

       @Override
       public boolean onKeyDown(int keyCode, KeyEvent event) {
           // Handle D-pad navigation
           switch (keyCode) {
               case KeyEvent.KEYCODE_DPAD_UP:
               case KeyEvent.KEYCODE_DPAD_DOWN:
               case KeyEvent.KEYCODE_DPAD_LEFT:
               case KeyEvent.KEYCODE_DPAD_RIGHT:
               case KeyEvent.KEYCODE_ENTER:
               case KeyEvent.KEYCODE_BACK:
                   return false; // Let JavaScript handle it
           }
           return super.onKeyDown(keyCode, event);
       }
   }
   ```

6. **Build APK:**
   ```bash
   # In Android Studio, go to Build → Build Bundle(s) / APK(s) → Build APK(s)
   # Or from terminal:
   ./gradlew assembleRelease
   ```

   Output: `app/build/outputs/apk/release/app-release.apk`

7. **Sideload on Android TV:**

   **Option A: USB connection**
   ```bash
   adb connect <TV_IP>:5555
   adb install -r app-release.apk
   ```

   **Option B: Via USB drive**
   - Copy `app-release.apk` to USB drive
   - Insert USB into TV
   - Go to Settings → About → Install from USB
   - Select APK file

## Alternative: Using Gradle (Command Line Only)

```bash
# From project root
npm run build

# Create Android project structure (one-time)
mkdir -p android-tv/app/src/main/assets
cp -r out/* android-tv/app/src/main/assets/

# Build APK
cd android-tv
./gradlew assembleRelease
cd ..

# APK output: android-tv/app/build/outputs/apk/release/app-release.apk
```

## Sideloading on Android TV

### Via ADB (Android Debug Bridge)

1. Enable Developer Options on TV:
   - Settings → About → Press Build Number 7 times
   - Go back to Settings → Developer Options
   - Enable USB Debugging / Debug via WiFi

2. Connect:
   ```bash
   adb connect <TV_IP>:5555
   ```

3. Install:
   ```bash
   adb install -r android-tv/app/build/outputs/apk/release/app-release.apk
   ```

4. Launch:
   ```bash
   adb shell am start -n com.example.unilearn/.MainActivity
   ```

### Via USB Drive (Easiest for Non-Technical Users)

1. Copy APK to USB drive
2. Insert USB into Android TV USB port
3. TV will prompt to install from USB
4. Select file and install
5. App appears in Apps menu

## Testing

After installation:
1. Remote should control D-pad navigation
2. OK/Enter selects items
3. Back button returns to home
4. App runs fully offline
5. Progress saves to device storage

## Troubleshooting

- **App won't launch**: Check Developer Options → USB Debugging
- **ADB not found**: Add Android SDK tools to PATH:
  ```bash
  export PATH="$PATH:$ANDROID_HOME/platform-tools"
  ```
- **APK installation fails**: Check device storage, try `adb install -r` (replace mode)
- **WebView crashes**: Ensure JavaScript and DOM storage are enabled in MainActivity

## Publishing to Play Store (Optional)

To distribute officially:

1. Sign APK:
   ```bash
   jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
     -keystore ~/my-key.keystore app-release-unsigned.apk my-key-alias
   ```

2. Create Google Play Developer account
3. Upload signed APK
4. Mark as Android TV app
5. Add screenshots for Android TV interface

## Notes

- All content bundled inside APK (~15–50 MB depending on assets)
- No internet required after installation
- Progress and settings stored in device's localStorage
- App runs in fullscreen, optimized for TV remotes
- Compatible with physical remote controls and air mice

## Update Workflow

To push a new version:

```bash
npm run build
cp -r out/* android-tv/app/src/main/assets/
cd android-tv && ./gradlew assembleRelease && cd ..
adb install -r android-tv/app/build/outputs/apk/release/app-release.apk
```
