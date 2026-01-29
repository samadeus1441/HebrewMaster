'use client';

import { useState, useEffect } from 'react';
import en from '@/messages/en.json';
import he from '@/messages/he.json';
import fr from '@/messages/fr.json';

const translations = { en, he, fr };

export function useLocale() {
  const [locale, setLocale] = useState<'en' | 'he' | 'fr'>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as 'en' | 'he' | 'fr';
    if (savedLocale) {
      setLocale(savedLocale);
      // שינוי כיוון הטקסט
      document.documentElement.dir = savedLocale === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLocale;
    }
  }, []);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { locale, t };
}
