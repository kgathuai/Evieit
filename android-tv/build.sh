#!/usr/bin/env bash
#
# Builds a signed, sideloadable Android TV APK from the Vite build in ../out.
#
# Deliberately does NOT use Gradle: the whole app is one Activity and a WebView,
# and building it with aapt2/d8/apksigner directly avoids the Android Gradle
# Plugin's strict Java version requirements. All it needs is:
#
#   ANDROID_HOME   an SDK with platforms/android-XX and build-tools/XX
#   java           a JDK on PATH
#
# Usage:  ./build.sh            (from android-tv/)
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
BUILD="$HERE/build"
APP="$HERE/app/src/main"

# ── locate the SDK ───────────────────────────────────────────────────────────
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
if [ -z "$SDK" ]; then
  for c in "$HOME/Library/Android/sdk" /tmp/android-sdk /usr/local/share/android-sdk; do
    [ -d "$c" ] && SDK="$c" && break
  done
fi
[ -n "$SDK" ] || { echo "No Android SDK found. Set ANDROID_HOME." >&2; exit 1; }
PLATFORM="$(ls -d "$SDK"/platforms/android-* 2>/dev/null | sort -V | tail -1)"
BUILD_TOOLS="$(ls -d "$SDK"/build-tools/* 2>/dev/null | sort -V | tail -1)"
[ -n "$PLATFORM" ] || { echo "No platform installed in $SDK" >&2; exit 1; }
[ -n "$BUILD_TOOLS" ] || { echo "No build-tools installed in $SDK" >&2; exit 1; }
echo "SDK        $SDK"
echo "platform   $(basename "$PLATFORM")"
echo "build-tools $(basename "$BUILD_TOOLS")"

# ── the web build must exist ─────────────────────────────────────────────────
if [ ! -f "$ROOT/out/index.html" ]; then
  echo "No web build at $ROOT/out - run 'npm run build' first." >&2
  exit 1
fi

# assets/ is generated: clear it, or files deleted from the web build linger
# in the APK forever.
rm -rf "$BUILD" "$APP/assets"
mkdir -p "$BUILD/compiled" "$BUILD/gen" "$BUILD/classes" "$BUILD/dex" "$APP/assets"

echo "==> bundling the web app into assets/"
cp -R "$ROOT/out/." "$APP/assets/"

# ── resources ────────────────────────────────────────────────────────────────
echo "==> aapt2 compile"
"$BUILD_TOOLS/aapt2" compile --dir "$APP/res" -o "$BUILD/compiled/res.zip"

echo "==> aapt2 link"
"$BUILD_TOOLS/aapt2" link \
  -o "$BUILD/app-unsigned.apk" \
  -I "$PLATFORM/android.jar" \
  --manifest "$APP/AndroidManifest.xml" \
  --java "$BUILD/gen" \
  --min-sdk-version 21 \
  --target-sdk-version 34 \
  -A "$APP/assets" \
  "$BUILD/compiled/res.zip"

# ── java ─────────────────────────────────────────────────────────────────────
echo "==> javac"
# --release 11 keeps the class files within what d8 understands, whatever JDK is
# on PATH (recent JDKs have dropped source/target 8).
javac --release 11 -Xlint:-options \
  -cp "$PLATFORM/android.jar" \
  -d "$BUILD/classes" \
  $(find "$BUILD/gen" "$APP/java" -name '*.java')

echo "==> d8"
"$BUILD_TOOLS/d8" \
  --lib "$PLATFORM/android.jar" \
  --min-api 21 \
  --output "$BUILD/dex" \
  $(find "$BUILD/classes" -name '*.class')

# ── assemble ─────────────────────────────────────────────────────────────────
echo "==> packaging"
cp "$BUILD/app-unsigned.apk" "$BUILD/app.apk"
( cd "$BUILD/dex" && zip -q "$BUILD/app.apk" classes.dex )

"$BUILD_TOOLS/zipalign" -f -p 4 "$BUILD/app.apk" "$BUILD/app-aligned.apk"

# ── signing ──────────────────────────────────────────────────────────────────
# A stable key matters: if it changes, Android refuses to update an installed
# app. Generated once and kept out of git - back it up.
KS="$HERE/keystore/unilearn.keystore"
if [ ! -f "$KS" ]; then
  echo "==> creating a signing key at $KS"
  mkdir -p "$(dirname "$KS")"
  keytool -genkeypair -v \
    -keystore "$KS" -alias unilearn -keyalg RSA -keysize 2048 -validity 10950 \
    -storepass android -keypass android \
    -dname "CN=Uni-Learn, OU=Education, O=Uni-Learn, L=Nairobi, C=KE" >/dev/null 2>&1
fi

OUT="$HERE/UniLearnTV.apk"
echo "==> signing"
"$BUILD_TOOLS/apksigner" sign \
  --ks "$KS" --ks-key-alias unilearn \
  --ks-pass pass:android --key-pass pass:android \
  --out "$OUT" "$BUILD/app-aligned.apk"

"$BUILD_TOOLS/apksigner" verify --print-certs "$OUT" | head -4 || true
echo
echo "APK: $OUT  ($(du -h "$OUT" | cut -f1))"
echo "Install with:  adb install -r \"$OUT\""
echo "Or copy it to a USB stick and open it on the TV."
