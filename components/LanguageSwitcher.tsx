'use client';

import { useLanguage } from '@/app/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as const, flag: '🇺🇸', label: 'EN' },
    { code: 'he' as const, flag: '🇮🇱', label: 'IL' },
    { code: 'fr' as const, flag: '🇫🇷', label: 'FR' }
  ];

  const handleChange = (newLocale: 'en' | 'he' | 'fr') => {
    setLanguage(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <div className="flex gap-2 justify-center items-center bg-white/5 p-2 rounded-2xl border border-white/10">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`
            flex flex-col items-center justify-center
            w-16 h-16 rounded-xl
            transition-all duration-200
            ${language === lang.code 
              ? 'bg-indigo-600 scale-110 shadow-lg shadow-indigo-500/50' 
              : 'bg-white/10 hover:bg-white/20 hover:scale-105'
            }
          `}
        >
          <span className="text-2xl mb-1">{lang.flag}</span>
          <span className={`text-[10px] font-bold tracking-wider ${
            language === lang.code ? 'text-white' : 'text-slate-400'
          }`}>
            {lang.label}
          </span>
        </button>
      ))}
    </div>
  );
}
