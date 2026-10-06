// Polyfills for the TV engines this app targets. Chrome 47 (Tizen 2016)
// predates all four of these, and the app plus MUI call them directly, so
// without this the app throws "Object.entries is not a function" on the
// exact televisions it is meant to reach.
import 'core-js/es/object/entries';
import 'core-js/es/object/values';
import 'core-js/es/object/from-entries';
import 'core-js/es/object/get-own-property-descriptors';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Nunito is bundled from node_modules rather than fetched from a CDN: this app
// is meant to run with no internet connection at all.
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-600.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-800.css';
import '@fontsource/nunito/latin-900.css';

import './globals.css';
import ThemeRegistry from './ThemeRegistry';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeRegistry>
      <App />
    </ThemeRegistry>
  </StrictMode>,
);
