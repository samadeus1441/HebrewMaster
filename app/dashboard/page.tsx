'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { getLevelFromXP, getNextLevel } from '@/lib/xp-system';

interface UserProfile {
  xp: number;
  level: number;
  streak: number;
  total_reviews: number;
}

interface DashboardStats {
  totalCards: number;
  dueCards: number;
  lessonsCompleted: number;
  wordsLearned: number;
  streak: number;
  level: number;
  levelName: string;
  xp: number;
  nextLevelXP: number;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalCards: 0,
    dueCards: 0,
    lessonsCompleted: 0,
    wordsLearned: 0,
    streak: 0,
    level: 1,
    levelName: 'אָלֶף',
    xp: 0,
    nextLevelXP: 100,
  });
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile with first name - FIXED: changed user_id to id
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)  // ✅ CHANGED FROM user_id TO id
        .single();

      const displayName = profileData?.first_name || user.email?.split('@')[0] || 'Student';
      setUserName(displayName);

      // Get or create user profile
      let { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        const { data: newProfile } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            xp: 0,
            level: 1,
            streak: 0,
          })
          .select()
          .single();
        profile = newProfile;
      }

      const currentLevel = getLevelFromXP(profile?.xp || 0);
      const nextLevel = getNextLevel(currentLevel.level);

      // Fetch cards stats
      const { data: cards } = await supabase
        .from('srs_cards')
        .select('*')
        .eq('user_id', user.id);

      const now = new Date();
      const dueCards = cards?.filter(card => new Date(card.next_review) <= now) || [];

      // Fetch lessons
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('student_user_id', user.id)
        .order('lesson_date', { ascending: false })
        .limit(3);

      setRecentLessons(lessons || []);

      setStats({
        totalCards: cards?.length || 0,
        dueCards: dueCards.length,
        lessonsCompleted: lessons?.length || 0,
        wordsLearned: cards?.length || 0,
        streak: profile?.streak || 0,
        level: currentLevel.level,
        levelName: currentLevel.name,
        xp: profile?.xp || 0,
        nextLevelXP: nextLevel.xpRequired,
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = ((stats.xp / stats.nextLevelXP) * 100) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-slate-400">Loading your journey...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-2" dir="rtl">
            שָׁלוֹם, {userName}! 👋
          </h1>
          <p className="text-xl text-slate-600">Welcome back to your Hebrew journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-indigo-100">
            <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
              Lessons Complete
            </div>
            <div className="text-5xl font-black text-slate-900 mb-1">
              {stats.lessonsCompleted}
            </div>
            <div className="text-slate-500 text-sm">Keep going!</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-amber-100">
            <div className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2">
              Words Learned
            </div>
            <div className="text-5xl font-black text-slate-900 mb-1">
              {stats.wordsLearned}
            </div>
            <div className="text-slate-500 text-sm">Your vocabulary</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-orange-100">
            <div className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-2">
              Day Streak
            </div>
            <div className="text-5xl font-black text-slate-900 mb-1 flex items-center gap-2">
              🔥 {stats.streak}
            </div>
            <div className="text-slate-500 text-sm">Days in a row</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-lg text-white">
            <div className="text-sm font-bold uppercase tracking-wider mb-2 opacity-90">
              Your Level
            </div>
            <div className="text-5xl font-black mb-1" dir="rtl">
              {stats.levelName} ⭐
            </div>
            <div className="text-sm opacity-90">Level {stats.level}</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-100 mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Progress to Next Level</h2>
              <p className="text-slate-600">
                {stats.xp} / {stats.nextLevelXP} XP to reach Level {stats.level + 1}
              </p>
            </div>
            <div className="text-4xl font-black text-indigo-600">
              {Math.round(progressPercentage)}%
            </div>
          </div>
          <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Due Cards Alert */}
        {stats.dueCards > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 shadow-lg mb-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-6xl">🃏</div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-1">
                    {stats.dueCards} cards due for review today
                  </h2>
                  <p className="text-slate-600">Keep your memory fresh!</p>
                </div>
              </div>
              <Link
                href="/dashboard/practice"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg transition-all"
              >
                Practice Now →
              </Link>
            </div>
          </div>
        )}

        {/* Recent Lessons */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-6">📚 Recent Lessons</h2>
          <div className="space-y-4">
            {recentLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href="/dashboard/lessons"
                className="block bg-white rounded-3xl p-6 shadow-lg border-2 border-slate-100 hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="bg-indigo-100 text-indigo-700 rounded-2xl px-4 py-2 font-black text-2xl">
                      {lesson.lesson_number || '?'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {lesson.summary?.split('.')[0] || 'Lesson ' + (lesson.lesson_number || '?')}
                      </h3>
                      <p className="text-slate-500">
                        {new Date(lesson.lesson_date).toLocaleDateString()} • 
                        {lesson.vocabulary?.length || 0} words
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm">
                      Review Cards
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/practice"
            className="bg-white hover:bg-indigo-50 rounded-3xl p-8 shadow-lg border-2 border-slate-100 hover:border-indigo-200 transition-all text-center group"
          >
            <div className="text-5xl mb-4">🃏</div>
            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600">
              Practice Flashcards
            </h3>
            <p className="text-slate-600">Review your vocabulary</p>
          </Link>

          <Link
            href="/dashboard/quiz"
            className="bg-white hover:bg-purple-50 rounded-3xl p-8 shadow-lg border-2 border-slate-100 hover:border-purple-200 transition-all text-center group"
          >
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-purple-600">
              Take a Quiz
            </h3>
            <p className="text-slate-600">Test your knowledge</p>
          </Link>

          <Link
            href="/dashboard/conversations"
            className="bg-white hover:bg-amber-50 rounded-3xl p-8 shadow-lg border-2 border-slate-100 hover:border-amber-200 transition-all text-center group"
          >
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-amber-600">
              Practice Conversations
            </h3>
            <p className="text-slate-600">Real-life scenarios</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
