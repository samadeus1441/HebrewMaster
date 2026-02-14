import './globals.css';
import { Assistant, Frank_Ruhl_Libre } from 'next/font/google';
import { LanguageProvider } from './context/LanguageContext';

// הפונט המודרני והנקי לעברית
const assistant = Assistant({ 
  subsets: ['hebrew', 'latin'],
  variable: '--font-assistant',
  display: 'swap',
});

// הפונט הקלאסי והסמכותי (סריף)
const frankRuhl = Frank_Ruhl_Libre({ 
  subsets: ['hebrew', 'latin'],
  variable: '--font-frank',
  display: 'swap',
});

export const metadata = {
  title: 'Hebrew Master | The Jerusalem Bridge',
  description: 'Identity-transforming Hebrew acquisition through historical lineage and sensory immersion.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={`${assistant.variable} ${frankRuhl.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
export const dynamic = 'force-dynamic';