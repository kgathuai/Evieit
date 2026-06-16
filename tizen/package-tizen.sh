#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/tizen/.build"
DIST_DIR="$ROOT_DIR/tizen/dist"
UNSIGNED_WGT="$DIST_DIR/UniLearnUSB-unsigned.wgt"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR" "$DIST_DIR"

cp "$ROOT_DIR/index.html" "$BUILD_DIR/"
cp "$ROOT_DIR/styles.css" "$BUILD_DIR/"
cp "$ROOT_DIR/app.js" "$BUILD_DIR/"
cp "$ROOT_DIR/tizen/config.xml" "$BUILD_DIR/"

# A simple placeholder icon for packaging. Replace with branded art later.
cat > "$BUILD_DIR/icon.b64" <<'EOF'
iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAGXRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjEyQz+5XQAAAC1JREFUWMPt0jENAAAIAzH5/59uD6mYBla0JbM7AAAAAAAAgN8N1uQAAe9p6KsAAAAASUVORK5CYII=
EOF
base64 -D -i "$BUILD_DIR/icon.b64" -o "$BUILD_DIR/icon.png"
rm -f "$BUILD_DIR/icon.b64"

(
  cd "$BUILD_DIR"
  rm -f "$UNSIGNED_WGT"
  zip -r "$UNSIGNED_WGT" ./* >/dev/null
)

echo "Created unsigned package: $UNSIGNED_WGT"
echo "Next: sign with Tizen Studio CLI, then install to TV using Device Manager or sdb."
