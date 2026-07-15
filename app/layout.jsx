import './globals.css';
import ThemeRegistry from './ThemeRegistry';

export const metadata = {
  title: 'Nana',
  description: 'Offline educational interface for children ages 3-7',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
