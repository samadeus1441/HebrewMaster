'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'wrong' | 'finished'>('playing');
  const [mistakes, setMistakes] = useState<any[]>([]);

  useEffect(() => { startNewGame(); }, []);

  // אנימציית מספרים רצים בסוף
  useEffect(() => {
    if (gameState === 'finished' && score > 0) {
      let start = 0;
      const duration = 1500;
      const increment = score / (duration / 20);
      const timer = setInterval(() => {
        start += increment;
        if (start >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(start));
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [gameState, score]);

  // פונקציית הסאונד והקראת המילים (הייתה חסרה!)
  const playFeedback = async (type: 'success' | 'error' | 'word') => {
    try {
      if (type === 'word') {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: currentQ.word_he }),
        });
        const blob = await response.blob();
        new Audio(URL.createObjectURL(blob)).play();
      } else {
        const url = type === 'success' 
          ? 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3' 
          : 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3';
        new Audio(url).play();
      }
    } catch (e) {}
  };

  async function startNewGame() {
    setLoading(true);
    setScore(0);
    setDisplayScore(0);
    setMistakes([]);
    setGameState('playing');
    const { data } = await supabase.from('vocabulary').select('*').limit(50);
    if (data && data.length > 0) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      setQuestions(shuffled);
      generateQuestion(shuffled[0], shuffled);
    }
    setLoading(false);
  }

  function generateQuestion(target: any, allWords: any[]) {
    const distractors = allWords.filter(w => w.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    const mixedOptions = [...distractors, target].sort(() => 0.5 - Math.random());
    setCurrentQ(target);
    setOptions(mixedOptions);
    setGameState('playing');
  }

  const handleAnswer = async (selectedId: string) => {
    if (gameState !== 'playing') return;
    const isCorrect = selectedId === currentQ.id;

    if (isCorrect) {
      setGameState('correct');
      setScore(prev => prev + 10);
      playFeedback('success'); // סאונד הצלחה
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('srs_cards').upsert({
          user_id: user.id,
          front: currentQ.word_he,
          back: currentQ.meaning_en,
          stability: 0.1,
          next_review: new Date().toISOString(),
          reps: 1
        }, { onConflict: 'user_id, front' });
      }
    } else {
      setGameState('wrong');
      setMistakes(prev => [...prev, currentQ]);
      playFeedback('error'); // סאונד טעות
    }

    setTimeout(() => {
      const nextIndex = questions.indexOf(currentQ) + 1;
      if (nextIndex < 10 && nextIndex < questions.length) {
        generateQuestion(questions[nextIndex], questions);
      } else {
        setGameState('finished');
        const finalScore = score + (isCorrect ? 10 : 0);
        if (finalScore >= 70) confetti();
        saveProgress(finalScore);
      }
    }, isCorrect ? 800 : 1500);
  };

  async function saveProgress(finalScore: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.rpc('update_user_xp', {
      user_id_input: user.id,
      xp_to_add: finalScore
    });
    if (!error) toast.success(`Success! +${finalScore} XP added`, { icon: '⚡' });
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">Loading Quiz...</div>;

  // דף תוצאות (היה חסר!)
  if (gameState === 'finished') return (
    <div className="max-w-2xl mx-auto p-8 flex flex-col items-center min-h-screen bg-slate-50 pt-16" dir="ltr">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-4">🏆</motion.div>
      <h1 className="text-4xl font-black text-slate-900 mb-2 text-center">Quiz Results</h1>
      <div className="w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 p-10 text-center mb-8">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2 text-center">XP Earned</p>
        <div className="text-7xl font-black text-indigo-600 mb-6 text-center">{displayScore}</div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(score / 100) * 100}%` }} className="h-full bg-indigo-500" />
        </div>
      </div>
      {mistakes.length > 0 && (
        <div className="w-full bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100 mb-8 text-left">
          <div className="bg-slate-900 p-4 text-white font-bold text-center">Words to Review</div>
          <table className="w-full border-collapse">
            <tbody>
              {mistakes.map((word, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="p-4 text-2xl font-bold text-right text-slate-800" dir="rtl">{word.word_he}</td>
                  <td className="p-4 text-slate-600 font-medium">{word.meaning_en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={startNewGame} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Start New Quiz</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[90vh]" dir="ltr">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8 font-bold">
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-slate-900">
            {questions.indexOf(currentQ) + 1} / 10
          </span>
          <span className="bg-indigo-600 px-6 py-2 rounded-xl text-white shadow-lg">{score} XP</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQ.id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`w-full bg-white rounded-[40px] shadow-xl p-12 text-center mb-10 border-4 transition-all duration-300 ${
              gameState === 'correct' ? 'border-green-500 bg-green-50/30' : 
              gameState === 'wrong' ? 'border-red-500 bg-red-50/30' : 'border-slate-50'
            }`}
          >
            <h1 className="text-8xl font-black text-slate-900 mb-6 leading-tight text-center" dir="rtl">{currentQ.word_he}</h1>
            {/* כפתור ה-Listen (היה חסר!) */}
            <button onClick={() => playFeedback('word')} className="text-indigo-600 font-bold flex items-center space-x-2 mx-auto px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors">
              <span>🔊</span><span>Listen</span>
            </button>
          </motion.div>
        </AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.id)}
              disabled={gameState !== 'playing'}
              className={`p-6 rounded-3xl text-xl font-bold transition-all border-2 text-left px-8 shadow-sm
                ${gameState === 'playing' ? 'bg-white border-slate-100 hover:border-indigo-300 text-slate-700' : ''}
                ${opt.id === currentQ.id && (gameState === 'correct' || gameState === 'wrong') ? 'bg-green-500 text-white border-green-600' : ''}
                ${gameState === 'wrong' && opt.id !== currentQ.id ? 'bg-red-50 border-red-200 text-red-400 opacity-50' : ''}
              `}
            >
              {opt.meaning_en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}