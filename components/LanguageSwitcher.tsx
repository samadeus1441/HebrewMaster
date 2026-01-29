'use client';

import { useLanguage } from '@/app/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'he' as const, name: 'עברית', flag: '🇮🇱' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' }
  ];

  const handleChange = (newLocale: 'en' | 'he' | 'fr') => {
    setLanguage(newLocale);
    // שמור ב-localStorage
    localStorage.setItem('locale', newLocale);
  };

  return (
    <select
      value={language}
      onChange={(e) => handleChange(e.target.value as 'en' | 'he' | 'fr')}
      className="px-4 py-2 rounded-lg bg-white border-2 border-indigo-200 font-medium cursor-pointer shadow-lg hover:shadow-xl transition-all"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
