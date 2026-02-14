'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { createBrowserClient } from '@supabase/ssr';
import {
  HomeIcon,
  BookOpenIcon,
  SparklesIcon,
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { getLevelFromXP } from '@/hooks/useGameification';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userXP, setUserXP] = useState(0);
  const [userStreak, setUserStreak] = useState(0);

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp, streak, display_name')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUserXP(profile.xp || 0);
          setUserStreak(profile.streak || 0);
          setUserName(profile.display_name || user.email?.split('@')[0] || '');
        }
      }
    };
    getUser();
  }, [supabase]);

  const levelInfo = getLevelFromXP(userXP);

  const navGroups = [
    {
      label: 'Main',
      links: [
        { name: 'Dashboard', icon: '🏠', href: '/dashboard', match: (p: string) => p === '/dashboard' },
        { name: 'My Lessons', icon: '📚', href: '/dashboard/lessons', match: (p: string) => p === '/dashboard/lessons' },
        { name: 'Homework', icon: '📝', href: '/dashboard/homework', match: (p: string) => p === '/dashboard/homework' },
      ],
    },
    {
      label: 'Practice',
      links: [
        { name: 'Flashcards', icon: '🃏', href: '/dashboard/practice', match: (p: string) => p === '/dashboard/practice' },
        { name: 'Quiz', icon: '🎯', href: '/dashboard/quiz', match: (p: string) => p === '/dashboard/quiz' },
        { name: 'Conversations', icon: '💬', href: '/dashboard/conversations', match: (p: string) => p === '/dashboard/conversations' },
      ],
    },
    {
      label: 'Tools',
      links: [
        { name: 'Reading', icon: '📖', href: '/dashboard/reading', match: (p: string) => p === '/dashboard/reading' },
        { name: 'Root Explorer', icon: '🌳', href: '/dashboard/roots', match: (p: string) => p === '/dashboard/roots' },
        { name: 'Conjugation', icon: '🔄', href: '/dashboard/conjugation', match: (p: string) => p === '/dashboard/conjugation' },
      ],
    },
    {
      label: 'Learn',
      links: [
        { name: 'Alphabet', icon: '🔤', href: '/dashboard/alphabet', match: (p: string) => p === '/dashboard/alphabet' },
        { name: 'Nikud', icon: '✡️', href: '/dashboard/nikud', match: (p: string) => p === '/dashboard/nikud' },
      ],
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex h-screen" style={{ background: 'var(--hm-bg, #FAFAF8)' }} dir="ltr">
      <Toaster position="top-center" />

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-lg border border-[#e5e2db]"
        >
          {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6 text-[#001B4D]" /> : <Bars3Icon className="w-6 h-6 text-[#001B4D]" />}
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static z-40 h-full w-64 bg-white border-r border-[#e5e2db] flex flex-col
        transform transition-transform duration-200
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-[#e5e2db]">
          <Link href="/dashboard" className="flex items-center gap-2 no-underline">
            <span className="text-xl">🇮🇱</span>
            <span className="font-serif text-lg font-bold text-[#001B4D]">Jerusalem Bridge</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-[#e5e2db] bg-[#FAFAF8]">
          <p className="text-sm font-bold text-[#001B4D] truncate">{userName || userEmail?.split('@')[0]}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-[#6b7280]">
            <span className="flex items-center gap-1">⭐ {userXP} XP</span>
            <span className="flex items-center gap-1">🔥 {userStreak}</span>
            <span className="font-semibold text-[#001B4D]">{levelInfo.name}</span>
          </div>
          {/* XP bar */}
          <div className="mt-2 h-1.5 bg-[#e5e2db] rounded-full overflow-hidden">
            <div className="h-full bg-[#001B4D] rounded-full transition-all" style={{ width: `${levelInfo.progress}%` }} />
          </div>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navGroups.map(group => (
            <div key={group.label} className="mb-1">
              <p className="px-5 py-1.5 text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.15em]">{group.label}</p>
              {group.links.map(link => {
                const isActive = link.match(pathname);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-2.5 text-sm no-underline transition ${
                      isActive
                        ? 'bg-[#001B4D]/[0.07] text-[#001B4D] font-semibold border-r-[3px] border-[#001B4D]'
                        : 'text-[#4a4a4a] hover:bg-[#FAFAF8] hover:text-[#001B4D]'
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#e5e2db] p-3 space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm text-[#6b7280] hover:text-[#001B4D] hover:bg-[#FAFAF8] rounded transition no-underline"
          >
            <Cog6ToothIcon className="w-4 h-4" /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-[#6b7280] hover:text-red-600 hover:bg-red-50 rounded transition w-full text-left"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
