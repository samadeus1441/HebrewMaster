'use client';

import { Heebo, Frank_Ruhl_Libre } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';

const heebo = Heebo({
  subsets: ['latin', 'hebrew'],
  variable: '--font-heebo',
  display: 'swap',
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ['latin', 'hebrew'],
  variable: '--font-frank-ruhl-libre',
  weight: ['400', '500', '700', '900'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="ltr">
      <body className={`${heebo.variable} ${frankRuhlLibre.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
