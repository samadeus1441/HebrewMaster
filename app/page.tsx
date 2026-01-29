import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dir-rtl font-sans">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇮🇱</span>
              <span className="text-xl font-bold text-blue-900">Hebrew Master</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                התחברות
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                התחל ללמוד חינם
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            🚀 הדרך החכמה ללמוד עברית
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            לדבר עברית בביטחון <br />
            <span className="text-blue-600">תוך 30 יום</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            המערכת המתקדמת שמתאימה את עצמה לקצב שלך. 
            תרגול יומיומי, משחקי מילים ומעקב התקדמות חכם.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/login" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2">
              מתחילים עכשיו בחינם
              <span>←</span>
            </Link>
            <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all">
              איך זה עובד?
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { title: 'למידה מותאמת אישית', icon: '🎯', desc: 'האלגוריתם שלנו מזהה את נקודות החוזק והחולשה שלך ובונה תוכנית אישית.' },
              { title: 'תרגול דיבור בזמן אמת', icon: 'mic', desc: 'טכנולוגיית זיהוי דיבור מתקדמת שתעזור לך לשפר את המבטא והביטחון.' },
              { title: 'מעקב התקדמות', icon: '📈', desc: 'דשבורד חכם שמראה לך בדיוק כמה השתפרת ומתי כדאי לחזור על חומר.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}