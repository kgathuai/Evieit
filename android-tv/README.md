# Android TV app (USB sideload)

A signed APK that wraps the Uni-Learn web build in a full-screen WebView. It is
the highest-reach *interactive* option for Kenya: the affordable smart TVs sold
there (Vitron, Syinix and similar) run Android TV, and an APK can be installed
from a USB stick with no store, no signing service, no developer mode and no
internet connection.

## What it is

`MainActivity` is a single WebView pointed at `file:///android_asset/index.html`.
The whole web build — JS, CSS, fonts and 212 images — is bundled into `assets/`,
so the app never touches the network.

It deliberately does *not* use Gradle. The app is one Activity and a WebView, so
building directly with `aapt2`, `javac`, `d8`, `zipalign` and `apksigner` avoids
the Android Gradle Plugin's strict Java-version requirements entirely. All you
need is an SDK and a JDK.

## Build

```bash
npm run build          # produces ../out
cd android-tv
ANDROID_HOME=/path/to/android-sdk ./build.sh
```

`build.sh` finds the newest `platforms/android-*` and `build-tools/*` under
`$ANDROID_HOME` (it also checks `~/Library/Android/sdk` and `/tmp/android-sdk`).
It needs platform 34 and build-tools 34.0.0 or newer.

Output: `android-tv/UniLearnTV.apk`.

The first run also creates `android-tv/keystore/unilearn.keystore`.

> **Keep that keystore.** Android refuses to update an installed app if the
> signing key changes. It is gitignored on purpose — back it up somewhere safe.
> Losing it means families must uninstall and reinstall.

## Install on a TV

**From a USB stick (no computer, no internet):**

1. Copy `UniLearnTV.apk` to a USB flash drive.
2. Plug it into the TV.
3. Open the TV's file manager (or a file-manager app) and select the APK.
4. Allow "install from unknown sources" when prompted.
5. Launch **Uni-Learn** from the TV's apps row.

**Over the network, if you have `adb`:**

```bash
adb connect <TV_IP>:5555
adb install -r UniLearnTV.apk
```

## TV behaviour

- **D-pad** — the web app handles arrow keys, so up/down/left/right and OK work
  on the remote with no extra code.
- **Back** — the remote's Back button is forwarded into the web app as
  Backspace, which returns to the lesson menu instead of closing the app.
- The screen is kept awake, the system UI is hidden, and the system font-size
  setting is ignored so the layout stays predictable.
- `leanback` is **not** marked required, so the same APK also installs on a
  phone or tablet. `minSdkVersion` is 21 (Android 5.0).

## Before publishing anywhere

- The package name is still `com.example.unilearn`. Change it in
  `app/src/main/AndroidManifest.xml` and in the `MainActivity` package
  declaration before any store release.
- Replace the signing key with a real, private one.

## Files

| Path | Purpose |
| --- | --- |
| `build.sh` | the whole build, no Gradle |
| `app/src/main/AndroidManifest.xml` | package, launcher entries, TV banner |
| `app/src/main/java/com/example/unilearn/MainActivity.java` | the WebView shell |
| `app/src/main/res/` | icon, TV banner, theme, app name |
| `app/src/main/assets/` | generated — the bundled web build |

`app/src/main/assets/`, `build/`, `keystore/` and `*.apk` are gitignored.
