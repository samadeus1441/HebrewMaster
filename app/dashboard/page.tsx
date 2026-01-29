'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { useLanguage } from '@/app/context/LanguageContext';

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ xp: 0, streak: 0, wordsLearned: 0, dueCards: 0, mastered: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Student');

  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUserName(user.email?.split('@')[0] || t('dashboard.student'));
      const userId = user.id;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', userId)
        .single();
      
      const { data: srsData } = await supabase
        .from('srs_cards')
        .select('*')
        .eq('user_id', userId);
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const activity = (srsData || []).reduce((acc: any, curr: any) => {
        if (!curr.last_review) return acc;
        const dayName = days[new Date(curr.last_review).getDay()];
        acc[dayName] = (acc[dayName] || 0) + (curr.reps || 1);
        return acc;
      }, {});

      setChartData(days.map(day => ({ name: day, xp: activity[day] || 0 })));
      
      setStats({
        xp: profileData?.xp || 0,
        streak: 0,
        wordsLearned: srsData?.length || 0,
        dueCards: (srsData || []).filter(s => new Date(s.due_date) <= new Date()).length,
        mastered: (srsData || []).filter(s => s.stability >= 1).length
      });

    } catch (error) {
      console.error('Dashboard Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadDashboardData(); 
  }, []);

  const modules = [
    { title: t('dashboard.modules.alphabet'), emoji: '🔤', href: '/dashboard/alphabet', gradient: 'from-blue-500 to-blue-700', stats: t('dashboard.modules.alphabetStats') },
    { title: t('dashboard.modules.nikud'), emoji: 'ֹא', href: '/dashboard/nikud', gradient: 'from-purple-500 to-purple-700', stats: t('dashboard.modules.nikudStats') },
    { title: t('dashboard.modules.vocabulary'), emoji: '📚', href: '/dashboard/vocabulary', gradient: 'from-green-500 to-green-700', stats: `${stats.wordsLearned} ${t('dashboard.modules.items')}` },
    { title: t('dashboard.modules.flashcards'), emoji: '🔄', href: '/dashboard/practice', gradient: 'from-orange-500 to-orange-700', stats: stats.dueCards > 0 ? `${stats.dueCards} ${t('dashboard.modules.due')}` : t('dashboard.modules.done') },
    { title: t('dashboard.modules.quiz'), emoji: '⚡', href: '/dashboard/quiz', gradient: 'from-amber-500 to-amber-700', stats: t('dashboard.modules.earnXP') }
  ];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="font-bold text-slate-400 tracking-widest uppercase text-xs">{t('dashboard.loading')}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6" dir="ltr">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 leading-tight capitalize">{t('dashboard.greeting')}, {userName}! 👋</h1>
        <p className="text-slate-500 text-sm font-medium">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('dashboard.stats.totalXP'), val: stats.xp, color: 'text-blue-600', icon: '⭐' },
          { label: t('dashboard.stats.streak'), val: stats.streak, color: 'text-orange-500', icon: '🔥' },
          { label: t('dashboard.stats.words'), val: stats.wordsLearned, color: 'text-emerald-500', icon: '📖' },
          { label: t('dashboard.stats.mastered'), val: stats.mastered, color: 'text-amber-500', icon: '🏆' }
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
            </div>
            <div className="text-2xl bg-slate-50 w-12 h-12 flex items-center justify-center rounded-2xl">{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {modules.map((m) => (
            <Link key={m.title} href={m.href} className="group">
              <div className={`bg-gradient-to-br ${m.gradient} rounded-[32px] p-5 text-white h-40 flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg group-hover:shadow-indigo-200`}>
                <div>
                  <div className="text-3xl mb-2">{m.emoji}</div>
                  <h3 className="text-lg font-bold leading-tight">{m.title}</h3>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">{m.stats}</span>
                  <span className="bg-white/20 p-1.5 rounded-full group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col h-full min-h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">{t('dashboard.weeklyActivity')}</h3>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase">{t('dashboard.srsProgress')}</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}} 
                />
                <Bar dataKey="xp" radius={[6, 6, 6, 6]} barSize={18}>
                  {chartData.map((e, i) => (
                    <Cell key={i} fill={e.xp > 0 ? '#6366f1' : '#f1f5f9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
