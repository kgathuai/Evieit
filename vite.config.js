import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Packaged TV apps are loaded from the `file://` scheme (LG documents this for
 * webOS; Tizen does the same), and ES modules are CORS-blocked there — a
 * `type="module"` script simply never executes. The previous Next.js build had
 * the same problem for a different reason: it emitted absolute `/_next/...`
 * paths, which resolve to a non-existent location under file://.
 *
 * So this emits ONE classic (IIFE) bundle with relative paths: no modules, no
 * dynamic import, no SystemJS. That is what a TV package can actually load.
 */
const classicScript = {
  name: 'classic-script',
  enforce: 'post',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      // Vite emits `type="module"` for the entry; downgrade it to a plain
      // deferred classic script so it runs from file:// as well as over http.
      return html.replace(/<script type="module" crossorigin/g, '<script defer');
    },
  },
};

export default defineConfig({
  plugins: [react(), classicScript],
  base: './',
  build: {
    outDir: 'out',
    emptyOutDir: true,
    // esbuild lowers optional chaining / nullish coalescing for this target.
    target: 'es2015',
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/app.js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
