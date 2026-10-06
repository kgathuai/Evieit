import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      // Televisions are the target and their engines are years behind: Chrome 47
      // is a 2016 Tizen set. This emits a second, ES5 bundle with core-js
      // polyfills that those engines load via <script nomodule>.
      targets: ['chrome >= 47'],
      // plugin-legacy overrides Vite's build.target for the modern bundle and
      // defaults it to Chrome 105+, which would leave optional chaining in
      // place and crash every TV from 2016-2021. Modern chunks are only ever
      // loaded by engines with ES-module support (Chrome 61+), so that is the
      // baseline worth targeting.
      modernTargets: 'chrome >= 63, firefox >= 67, safari >= 12, edge >= 79',
      modernPolyfills: true,
    }),
  ],
  // Relative asset URLs, because Tizen and webOS packages load the app straight
  // from file:// where absolute "/assets/..." paths do not resolve.
  base: './',
  build: {
    // Kept as `out/` so the existing tizen/, webos/ and pi-kiosk/ scripts and
    // DEPLOYMENT.md keep working unchanged.
    outDir: 'out',
    emptyOutDir: true,
    // Keep even the modern bundle parseable by engines that support ES modules
    // but sit far below today's baseline (Chrome 61-79 televisions).
    target: 'es2015',
    // Vite's module-preload polyfill is the only thing emitting `import.meta`,
    // which needs Chrome 64. Disabling it removes that dependency, so the
    // modern chunk also runs on Chromium 63 televisions (2019 Samsung sets),
    // which support ES modules and therefore never receive the legacy bundle.
    modulePreload: { polyfill: false },
  },
});
