'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇮🇱</span>
              <span className="text-xl font-bold text-blue-900">Hebrew Master</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                {t('landing.login')}
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                {t('landing.startFree')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            🚀 {t('landing.badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {t('landing.heroTitle1')} <br />
            <span className="text-blue-600">{t('landing.heroTitle2')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/login" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2">
              {t('landing.startNow')}
              <span>→</span>
            </Link>
            <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all">
              {t('landing.howItWorks')}
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.feature1Title')}</h3>
              <p className="text-gray-600">{t('landing.feature1Desc')}</p>
            </div>
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.feature2Title')}</h3>
              <p className="text-gray-600">{t('landing.feature2Desc')}</p>
            </div>
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('landing.feature3Title')}</h3>
              <p className="text-gray-600">{t('landing.feature3Desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
