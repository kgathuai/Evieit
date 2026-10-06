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

Packaged TV apps are loaded from the **`file://` scheme** (LG documents this for
webOS; Tizen behaves the same way), and **ES modules are CORS-blocked there** —
a `type="module"` script never executes. So the build emits **one classic (IIFE)
bundle** with relative asset paths (see `vite.config.js`): no modules, no dynamic
import, no SystemJS. That is what a TV package can actually load.

`build.target` is `es2015`, so optional chaining and nullish coalescing are
lowered at build time. They are a *parse error* below Chromium 80 — which is
every television from roughly 2016 to 2021.

`core-js` supplies the runtime methods those engines lack — `Object.entries`,
`Object.values`, `Object.fromEntries` and `Object.getOwnPropertyDescriptors` are
all post-Chrome 53, and the app throws without them.

The emitted bundle is verified with `acorn` (`npm run check:syntax`): it parses
as ES2015 and contains zero optional-chaining, nullish-coalescing or class-field
nodes.

The CSS is downleveled as well. MUI/Emotion injects component styles at runtime
from JavaScript, so PostCSS never sees them and this has to be done by hand:

- root scaling uses media queries instead of `clamp()`, `min()` or `max()`
- every `clamp()` in `LessonPanel.jsx` declares a plain rem fallback first and
  only upgrades inside `@supports (font-size: clamp(1px, 1vw, 2px))`
- `aspect-ratio` (Chromium 88) gets an `@supports not` height fallback, because
  without it the lesson tiles collapse to the height of their text
- flexbox `gap` (Chromium 84) gets `@supports not` margin fallbacks
- no CSS custom properties anywhere, since those need Chromium 49 — the app
  originally set its overscan padding with `var(--safe-x)`, which a Chromium 47
  television ignores completely

Remaining limits:

- MUI still emits a few `var(--…)` values (`--IconButton-hoverBg`,
  `--Paper-shadow`) from its CSS-variables code path. That path is not enabled
  by our theme, so they are inert on modern browsers too.
- Speech narration uses the Web Speech API, which varies by TV model and firmware.
- Progress is stored in `localStorage`, which some TV browsers restrict.
