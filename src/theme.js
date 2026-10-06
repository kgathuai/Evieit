import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b6b',   // vibrant coral-red — playful and eye-catching
      dark: '#e63946',   // darker coral for contrast
      light: '#ffa5a5', // lighter coral for backgrounds
    },
    secondary: {
      main: '#ffd93d',   // bright sunny yellow
    },
    success: {
      main: '#6bcf7f',   // vibrant green
      light: '#a8e6b8', // lighter green
    },
    warning: {
      main: '#ff9f1c',   // bright orange
    },
    info: {
      main: '#4ecdc4',   // turquoise
    },
    background: {
      default: 'linear-gradient(135deg, #ffe5e5 0%, #fff4d1 50%, #e0f7f4 100%)',
      paper: '#ffffff',
    },
  },
  /*
   * MUI spacing drives every `sx` padding and gap in the app. It is expressed
   * in rem so the layout keeps its current 8px-per-unit look at the 16px base
   * size, but grows with the root font size on larger TV panels instead of
   * staying pinned to fixed pixels.
   */
  spacing: (factor) => `${factor * 0.5}rem`,
  typography: {
    fontFamily: '"Nunito", "Segoe UI", sans-serif',
    h1: { fontWeight: 900, fontSize: '3.5rem' },
    h2: { fontWeight: 800, fontSize: '2.2rem' },
    h5: { fontWeight: 800, fontSize: '1.8rem' },
    h6: { fontWeight: 800, fontSize: '1.3rem' },
    body1: { fontSize: '1.1rem', fontWeight: 600 },
    body2: { fontSize: '1rem', fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 800,
          fontSize: '1.1rem',
          borderRadius: 20,
          // rem rather than px, so TV panels enlarge the touch/remote target too
          padding: '0.875rem 1.75rem',   // 14px / 28px at the 16px base
          minHeight: '3.5rem',           // 56px
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 28, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, fontSize: '0.95rem', padding: '0.5rem 0.75rem' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '0.875rem',
          fontSize: '1.8rem',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { transform: 'scale(1.3)' },
      },
    },
  },
});

export default theme;
