'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HebrewLetter {
  id: string;
  print: string;
  cursive: string;
  name_en: string;
  translit: string;
  sound_en: string;
  tip_en: string;
  value: number;
  has_variant: boolean;
  variant_print?: string;
  variant_name_en?: string;
}

export default function AlphabetPage() {
  const [letters, setLetters] = useState<HebrewLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<HebrewLetter | null>(null);
  const [showCursive, setShowCursive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    const { data, error } = await supabase
      .from('hebrew_letters')
      .select('*')
      .order('position');

    if (data) {
      setLetters(data);
    }
    setLoading(false);
  };

  const playAudio = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        await audio.play();
      }
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="text-xl font-bold">Loading alphabet...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">The Hebrew Alphabet</h1>
            <p className="text-lg text-gray-600">22 letters, each with its own story</p>
          </div>
          
          <button
            onClick={() => setShowCursive(!showCursive)}
            className="px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-gray-200"
          >
            Show: {showCursive ? '✍️ Cursive' : '🔤 Print'}
          </button>
        </div>

        {/* Alphabet Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {letters.map((letter) => (
            <button
              key={letter.id}
              onClick={() => setSelectedLetter(letter)}
              className={`
                bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300
                hover:scale-105 cursor-pointer text-center group
                ${selectedLetter?.id === letter.id ? 'ring-4 ring-blue-500 scale-105' : ''}
              `}
            >
              <div className="text-6xl font-bold text-gray-800 mb-2" dir="rtl">
                {showCursive ? letter.cursive : letter.print}
              </div>
              <div className="text-sm font-bold text-gray-700">{letter.name_en}</div>
              <div className="text-xs text-gray-500">/{letter.translit}/</div>
            </button>
          ))}
        </div>

        {/* Letter Detail Card */}
        {selectedLetter && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-200 animate-in fade-in zoom-in duration-300">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Letter Display */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12">
                <div className="text-9xl font-bold text-blue-600 mb-4" dir="rtl">
                  {showCursive ? selectedLetter.cursive : selectedLetter.print}
                </div>
                <button
                  onClick={() => playAudio(selectedLetter.print)}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                  Play Sound
                </button>
              </div>

              {/* Right: Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">{selectedLetter.name_en}</h2>
                  <p className="text-xl text-gray-600">Pronounced: /{selectedLetter.translit}/</p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 mb-2">🔊 Sound</h3>
                  <p className="text-gray-700">{selectedLetter.sound_en}</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 mb-2">💡 Tip</h3>
                  <p className="text-gray-700">{selectedLetter.tip_en}</p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 mb-2">🔢 Numerical Value</h3>
                  <p className="text-3xl font-bold text-green-600">{selectedLetter.value}</p>
                </div>

                {selectedLetter.has_variant && (
                  <div className="bg-orange-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-800 mb-2">🔄 Variant Form</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-bold" dir="rtl">{selectedLetter.variant_print}</span>
                      <div>
                        <p className="font-bold">{selectedLetter.variant_name_en}</p>
                        <p className="text-sm text-gray-600">Without dagesh (dot)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!selectedLetter && (
          <div className="text-center text-gray-500 italic text-lg mt-12">
            Click any letter above to learn more about it
          </div>
        )}
      </div>
    </div>
  );
}
