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
