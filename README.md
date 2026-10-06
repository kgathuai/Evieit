# Uni-Learn USB

Uni-Learn USB is an offline, TV-first educational interface for ages 3-7.
It is designed for households with a TV and remote, without requiring a gaming console or computer.

## What Is Included

- Alphabet module (A-Z)
- Numeracy module (1-100)
- Logic game: What's Next?
- Recognition game: Find the Letter
- D-pad style controls with OK/Enter
- Audio narration for letters, numbers, and game prompts
- Local progress tracking (stars, levels, accuracy) via browser local storage

## Quick Start

1. Open `index.html` in a browser.
2. Use arrow keys to simulate TV remote D-pad.
3. Press Enter (OK) to select.
4. Press Backspace to return to the home menu.
5. Press M to toggle narration on/off.

## USB Deployment Idea

- Copy all files in this folder to a USB flash drive.
- Open `index.html` on a Smart TV browser (or kiosk shell) if supported.
- For Smart TVs that support sideloaded web apps, package these files as the app payload.

## Samsung Tizen Sideload Package

This project includes a **specific platform package path** for Samsung Tizen TVs:

- Packaging config: `tizen/config.xml`
- Build script: `tizen/package-tizen.sh`
- Full sideload guide: `tizen/README.md`

## Project Files

- `index.html`: Main interface shell
- `styles.css`: Visual theme and responsive layout
- `app.js`: Navigation and learning logic
- `docs/uni-learn-concept-paper.md`: Full concept paper
- `tizen/`: Samsung Tizen packaging files and instructions

## Notes

This version is intentionally offline and dependency-free so it can run in low-connectivity environments.

## Browser & TV Compatibility

The app is built with **Vite** (`vite.config.js`) and ships two bundles:

- a modern bundle for current browsers
- an **ES2015 bundle plus core-js polyfills**, selected automatically on older
  engines via `<script nomodule>` and a capability canary

`@vitejs/plugin-legacy` is configured with `targets: ['chrome >= 47']`, so the
app reaches back towards 2016 Tizen sets instead of the 2024+ models a stock
Next.js 15 build required (its runtime shipped optional chaining, which is a
parse error on anything below Chromium 80). Older engines fall back to the
legacy bundle on their own — nothing to configure on the TV.

Known remaining limits:

- CSS still uses `clamp()`, flexbox `gap`, `aspect-ratio` and `:where()`, which
  need Chromium 79-88. On older engines these degrade (missing gaps, dropped
  fluid type) rather than break, so the layout is not pixel-correct there.
- Speech narration uses the Web Speech API, which varies by TV model and firmware.
- Progress is stored in `localStorage`, which some TV browsers restrict.

Build output stays in `out/` and assets are referenced **relatively**, so the
same build works from `file://` inside Tizen and webOS packages as well as from
a web server.
