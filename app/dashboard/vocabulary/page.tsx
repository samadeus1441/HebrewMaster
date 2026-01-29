'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { transliterate } from 'hebrew-transliteration';
import { useLanguage } from '@/app/context/LanguageContext';

export default function VocabularyPage() {
  const { t } = useLanguage();
  const [words, setWords] = useState<any[]>([]);
  const [newWord, setNewWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const playWordSound = async (hebrewText: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: hebrewText }),
      });
      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    } catch (error) {
      console.error('Sound error:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('srs_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWords(data || []);
    } catch (err) {
      console.error('Error fetching:', err);
    } finally {
      setLoading(false);
    }
  };

  const addWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !translation) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const autoTranslit = transliterate(newWord);

    const { error } = await supabase.from('srs_cards').insert([
      {
        user_id: user.id,
        front: newWord,
        back: translation,
        transliteration: autoTranslit,
        next_review: new Date().toISOString(),
        stability: 0,
        reps: 0
      }
    ]);

    if (error) {
      console.error('Insert Error:', error.message);
      alert(t('vocabulary.addError') + error.message);
    } else {
      setNewWord('');
      setTranslation('');
      fetchData();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
    }
  };

  const deleteWord = async (id: string) => {
    const { error } = await supabase.from('srs_cards').delete().eq('id', id);
    if (!error) fetchData();
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">{t('vocabulary.loading')}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="ltr">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">{t('vocabulary.title')}</h1>

        <form onSubmit={addWord} className="bg-white p-4 rounded-[32px] shadow-sm border border-slate-100 mb-12 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder={t('vocabulary.hebrewPlaceholder')}
            className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            dir="rtl"
          />
          <input
            type="text"
            placeholder={t('vocabulary.translationPlaceholder')}
            className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
          />
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            {t('vocabulary.addWord')}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {words.map((word) => (
              <motion.div
                key={word.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-56 group hover:border-indigo-200 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {t('vocabulary.new')}
                  </div>
                  <button 
                    onClick={() => deleteWord(word.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="text-center flex-1 flex flex-col justify-center">
                  <h2 className="text-4xl font-black text-slate-900 mb-1" dir="rtl">{word.front}</h2>
                  {word.transliteration && (
                    <p className="text-sm text-indigo-600 font-semibold italic mb-2">{word.transliteration}</p>
                  )}
                  <p className="text-slate-500 font-bold">{word.back}</p>
                </div>

                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => playWordSound(word.front)}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <span>🔊</span>
                    <span>{t('vocabulary.listen')}</span>
                  </button>
                </div>

                <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden mt-4">
                  <div className="bg-indigo-500 h-full w-2" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
