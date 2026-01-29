'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PracticePage() {
  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing'>('idle');

  // שימוש ב-ID הקבוע כדי להבטיח סנכרון עם ה-SQL Editor
  const fixedUserId = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    setLoading(true);
    // שליפת מילים לתרגול
    const { data } = await supabase
      .from('vocabulary')
      .select('id, word_he, translit, meaning_en')
      .limit(50);

    if (data && data.length > 0) {
      const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 10);
      setWords(shuffled);
    }
    setLoading(false);
  }

  const handleRating = async (rating: string) => {
    const currentWord = words[currentIndex];
    const ratingMap: Record<string, number> = {
      'again': 1,
      'hard': 2,
      'good': 3,
      'easy': 4
    };

    try {
      // קריאה לפונקציה החכמה ב-Supabase
      await supabase.rpc('update_srs_item', {
        user_id_input: fixedUserId,
        content_id_input: currentWord.id,
        content_type_input: 'vocabulary',
        rating_input: ratingMap[rating]
      });
    } catch (error) {
      console.error('Error saving SRS:', error);
    }

    if (currentIndex < words.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionComplete(true);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    window.speechSynthesis.speak(utterance);
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-white font-bold text-slate-400">טוען תרגול...</div>;

  if (sessionComplete) return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center p-6">
      <div className="text-8xl mb-6">🎉</div>
      <h1 className="text-4xl font-black text-slate-900 mb-2">כל הכבוד!</h1>
      <p className="text-slate-500 mb-8">השלמת את התרגול והנתונים נשמרו בזיכרון המערכת.</p>
      <button 
        onClick={() => window.location.href = '/dashboard'} 
        className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
      >
        חזרה לדשבורד
      </button>
    </div>
  );

  const currentWord = words[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6" dir="ltr">
      <div className="w-full max-w-md mb-8 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        ></div>
      </div>

      <div className="w-full max-w-md aspect-[4/5] relative perspective-1000">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 bg-white border border-slate-100 shadow-xl rounded-[40px] p-8 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => setIsFlipped(true)}
            >
              <span className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-12">Click to flip</span>
              <h1 className="text-7xl font-black mb-3 text-slate-900" dir="rtl">{currentWord.word_he}</h1>
              
              {/* התעתיק בצד הקדמי */}
              {currentWord.translit && (
                <p className="text-xl text-indigo-400 font-semibold mb-8 italic">
                  ({currentWord.translit})
                </p>
              )}
              
              <button 
                onClick={(e) => { e.stopPropagation(); playAudio(currentWord.word_he); }}
                className="p-4 rounded-full bg-indigo-50 text-indigo-500 hover:bg-indigo-100"
              >
                🔊
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white border border-indigo-100 shadow-xl rounded-[40px] p-8 flex flex-col items-center justify-between"
            >
              <div className="text-center mt-10">
                <h2 className="text-5xl font-black mb-2 text-slate-900" dir="rtl">{currentWord.word_he}</h2>
                <p className="text-xl text-indigo-500 font-bold mb-6 italic">{currentWord.translit}</p>
                <div className="bg-slate-50 px-8 py-6 rounded-3xl border border-slate-100">
                  <p className="text-3xl font-bold text-slate-800">{currentWord.meaning_en}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button onClick={() => handleRating('again')} className="py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200">Again</button>
                <button onClick={() => handleRating('hard')} className="py-4 rounded-2xl bg-orange-50 text-orange-600 font-bold hover:bg-orange-100">Hard</button>
                <button onClick={() => handleRating('good')} className="py-4 rounded-2xl bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100">Good</button>
                <button onClick={() => handleRating('easy')} className="py-4 rounded-2xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-100">Easy</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
