'use client';

import { Heebo, Frank_Ruhl_Libre } from 'next/font/google';
import './globals.css';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

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

// קומפוננטה פנימית לבחירת שפה
function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex gap-3 bg-white border-2 border-slate-200 p-3 rounded-2xl shadow-2xl">
      <button 
        onClick={() => setLanguage('en')} 
        className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl transition-all ${language === 'en' ? 'bg-indigo-100 scale-110 border-2 border-indigo-200' : 'hover:bg-slate-50'}`}
      >
        🇺🇸
      </button>
      <button 
        onClick={() => setLanguage('he')} 
        className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl transition-all ${language === 'he' ? 'bg-indigo-100 scale-110 border-2 border-indigo-200' : 'hover:bg-slate-50'}`}
      >
        🇮🇱
      </button>
      <button 
        onClick={() => setLanguage('fr')} 
        className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl transition-all ${language === 'fr' ? 'bg-indigo-100 scale-110 border-2 border-indigo-200' : 'hover:bg-slate-50'}`}
      >
        🇫🇷
      </button>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="ltr">
      <body className={`${heebo.variable} ${frankRuhlLibre.variable} font-sans antialiased`}>
        <LanguageProvider>
          <LanguageSelector />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}