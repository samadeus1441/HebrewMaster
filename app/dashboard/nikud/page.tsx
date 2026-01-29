'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Nikud {
  id: string;
  symbol: string;
  display: string;
  name_en: string;
  sound_en: string;
  category: string;
  teaching_order: number;
}

export default function NikudPage() {
  const [nikudList, setNikudList] = useState<Nikud[]>([]);
  const [selectedNikud, setSelectedNikud] = useState<Nikud | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNikud();
  }, []);

  const loadNikud = async () => {
    const { data, error } = await supabase
      .from('nikud')
      .select('*')
      .order('teaching_order');

    if (data) {
      setNikudList(data);
      if (data.length > 0) {
        setSelectedNikud(data[0]);
      }
    }
    setLoading(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'a': 'from-red-400 to-red-600',
      'e': 'from-orange-400 to-orange-600',
      'i': 'from-yellow-400 to-yellow-600',
      'o': 'from-green-400 to-green-600',
      'u': 'from-blue-400 to-blue-600',
      'reduced': 'from-purple-400 to-purple-600'
    };
    return colors[category] || 'from-gray-400 to-gray-600';
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
      <div className="text-xl font-bold">Loading vowel points...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nikud - Vowel Points</h1>
          <p className="text-lg text-gray-600">Master the 10 essential vowel markings</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Nikud Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">10 Vowel Points</h2>
            <div className="grid grid-cols-2 gap-4">
              {nikudList.map((nikud) => (
                <button
                  key={nikud.id}
                  onClick={() => setSelectedNikud(nikud)}
                  className={`
                    bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300
                    hover:scale-105 cursor-pointer group relative overflow-hidden
                    ${selectedNikud?.id === nikud.id ? 'ring-4 ring-purple-500 scale-105' : ''}
                  `}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(nikud.category)} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="text-7xl font-bold text-gray-800 mb-2" dir="rtl">
                      {nikud.display}
                    </div>
                    <div className="text-sm font-bold text-gray-700">{nikud.name_en}</div>
                    <div className="text-xs text-gray-500 mt-1">{nikud.sound_en}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Category Legend */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4">Sound Categories</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600"></div>
                  <span>A sounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
                  <span>E sounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
                  <span>I sounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                  <span>O sounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <span>U sounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <span>Reduced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detail Card */}
          {selectedNikud && (
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200 animate-in fade-in zoom-in duration-300">
                {/* Display */}
                <div className={`bg-gradient-to-br ${getCategoryColor(selectedNikud.category)} rounded-2xl p-12 mb-6 flex flex-col items-center justify-center`}>
                  <div className="text-9xl font-bold text-white mb-4" dir="rtl">
                    {selectedNikud.display}
                  </div>
                  <button
                    onClick={() => playAudio(selectedNikud.display)}
                    className="px-6 py-3 bg-white text-gray-800 rounded-xl hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2 font-bold"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    Play Sound
                  </button>
                </div>

                {/* Information */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{selectedNikud.name_en}</h2>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Vowel Point #{selectedNikud.teaching_order}</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span>🔊</span> Sound
                    </h3>
                    <p className="text-lg text-gray-700">{selectedNikud.sound_en}</p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span>📝</span> Symbol
                    </h3>
                    <p className="text-gray-700">
                      This is the <span className="font-mono text-2xl">{selectedNikud.symbol}</span> mark
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Written {selectedNikud.category === 'o' || selectedNikud.category === 'u' ? 'with' : 'under'} the letter
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span>🎯</span> Category
                    </h3>
                    <p className="text-gray-700 capitalize">{selectedNikud.category} sound family</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Practice Tip */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="text-5xl">💡</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Learning Tip</h3>
              <p className="text-gray-700 leading-relaxed">
                Hebrew vowels are not letters - they're dots and lines added to consonants. 
                Modern Hebrew texts often skip them (unpointed text), but they're essential for learning. 
                Master these 10 points and you'll be able to read anything!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
