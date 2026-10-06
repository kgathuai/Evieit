import { Nunito } from 'next/font/google';
import './globals.css';
import ThemeRegistry from './ThemeRegistry';

/*
 * The typeface is self-hosted at build time rather than pulled from the Google
 * Fonts CDN. This app is meant to run with no internet at all, and the previous
 * `@import url(fonts.googleapis.com/...)` could never resolve offline — the app
 * silently fell back to Trebuchet MS on exactly the devices it targets.
 */
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata = {
  title: 'Nana',
  description: 'Offline educational interface for children ages 3-7',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
