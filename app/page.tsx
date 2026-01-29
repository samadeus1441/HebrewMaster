'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    xp: 0,
    streak: 0,
    wordsLearned: 0,
    dueCards: 0
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // שימוש ב-UUID תקני (אפסים) כדי למנוע שגיאה 400
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      // בדיקה בטוחה של כרטיסים (לא קורס אם הטבלה חסרה)
      const { count, error: srsError } = await supabase
        .from('srs_cards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .lte('due_date', new Date().toISOString());
      
      if (userStats) {
        setStats({
          xp: userStats.total_xp || 0,
          streak: userStats.current_streak || 0,
          wordsLearned: userStats.words_learned || 0,
          dueCards: count || 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // ריענון אוטומטי כשחוזרים מה-Quiz
    window.addEventListener('focus', loadStats);
    return () => window.removeEventListener('focus', loadStats);
  }, []);

  const modules = [
    {
      title: 'Alphabet',
      description: 'Master the 22 letters',
      emoji: '🔤',
      href: '/dashboard/alphabet',
      gradient: 'from-blue-500 to-blue-700',
      stats: '22 letters'
    },
    {
      title: 'Vocabulary',
      description: 'Build your word bank',
      emoji: '📚',
      href: '/dashboard/vocabulary',
      gradient: 'from-green-500 to-green-700',
      stats: `${stats.wordsLearned} learned`
    },
    {
      title: 'Quiz Mode',
      description: 'Test your knowledge',
      emoji: '⚡',
      href: '/dashboard/quiz',
      gradient: 'from-amber-500 to-amber-700',
      stats: 'Earn XP'
    },
    {
      title: 'Flashcards',
      description: 'Spaced repetition',
      emoji: '🔄',
      href: '/dashboard/practice',
      gradient: 'from-orange-500 to-orange-700',
      stats: stats.dueCards > 0 ? `${stats.dueCards} due` : 'Up to date'
    }
  ];

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 font-bold text-slate-400 uppercase tracking-widest">
      Loading Master...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8" dir="ltr">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Shalom! 👋</h1>
          <p className="text-lg text-slate-500 font-medium">Your Hebrew journey continues.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02]">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total XP</p>
              <p className="text-4xl font-black text-indigo-600 mt-1">{stats.xp}</p>
            </div>
            <div className="text-5xl">⭐</div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02]">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Streak</p>
              <p className="text-4xl font-black text-orange-500 mt-1">{stats.streak} Days</p>
            </div>
            <div className="text-5xl">🔥</div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100 flex items-center justify-between transition-transform hover:scale-[1.02]">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Words</p>
              <p className="text-4xl font-black text-emerald-500 mt-1">{stats.wordsLearned}</p>
            </div>
            <div className="text-5xl">📚</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <Link key={module.title} href={module.href}>
              <div className={`bg-gradient-to-br ${module.gradient} rounded-[40px] shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer p-10 text-white flex flex-col h-64 justify-between group`}>
                <div>
                  <div className="text-5xl mb-4 group-hover:rotate-12 transition-transform">{module.emoji}</div>
                  <h3 className="text-3xl font-bold">{module.title}</h3>
                  <p className="text-white/80 mt-1 font-medium">{module.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md">{module.stats}</span>
                  <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}