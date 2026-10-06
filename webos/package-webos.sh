#!/bin/bash

# LG webOS Packaging Script
# Builds the Vite static export and packages for webOS deployment

set -e

echo "Building app..."
npm run build

echo "Preparing webOS build directory..."
rm -rf webos/.build
mkdir -p webos/.build
cp -r out/* webos/.build/

echo "Creating distribution directory..."
mkdir -p webos/dist

echo "Packaging webOS app..."
cd webos/.build

# Create the ipk package using webos CLI
# The ipk is essentially a tar.gz with appinfo.json at root
tar -czf ../dist/com.example.unilearn_0.1.0_all.ipk \
  --exclude='node_modules' \
  --exclude='.next' \
  .

cd ../..

echo "✓ webOS package created: webos/dist/com.example.unilearn_0.1.0_all.ipk"
echo ""
echo "Next steps:"
echo "1. Install webOS SDK: https://developer.lge.com/webos-tv/"
echo "2. Enable Developer Mode on your LG TV"
echo "3. Run: webos-cli device add <name> <TV_IP>"
echo "4. Run: webos-cli app install -d <name> webos/dist/com.example.unilearn_0.1.0_all.ipk"
