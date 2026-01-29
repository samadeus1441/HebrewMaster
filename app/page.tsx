import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="p-6 border-b flex justify-between items-center dir-rtl">
        <h1 className="text-2xl font-bold text-blue-600">Hebrew Master</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 text-gray-600">התחברות</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">הרשמה חינם</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          ללמוד עברית ברמה של שפת אם
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          הצטרפו לאלפי תלמידים שכבר מדברים עברית בביטחון עם המערכת החכמה שלנו.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-blue-700 transition">
            התחילו ללמוד עכשיו
          </button>
        </div>
      </div>
    </main>
  );
}