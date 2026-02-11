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
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { getLevelFromXP } from '@/hooks/useGameification';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
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
          .select('xp, streak')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUserXP(profile.xp || 0);
          setUserStreak(profile.streak || 0);
        }
      }
    };
    getUser();
  }, [supabase]);

  const levelInfo = getLevelFromXP(userXP);

  const links = [
    { name: '🏠 ' + t('nav.dashboard'), href: '/dashboard', match: (p: string) => p === '/dashboard' },
    { name: '📚 My Lessons', href: '/dashboard/lessons', match: (p: string) => p === '/dashboard/lessons' },
    { name: '🃏 ' + t('nav.flashcards'), href: '/dashboard/practice', match: (p: string) => p === '/dashboard/practice' },
    { name: '🎯 ' + t('nav.quiz'), href: '/dashboard/quiz', match: (p: string) => p === '/dashboard/quiz' },
    { name: '💬 Conversations', href: '/dashboard/conversations', match: (p: string) => p === '/dashboard/conversations' },
    { name: '🔤 ' + t('nav.alphabet'), href: '/dashboard/alphabet', match: (p: string) => p === '/dashboard/alphabet' },
    { name: '✡️ ' + t('nav.nikud'), href: '/dashboard/nikud', match: (p: string) => p === '/dashboard/nikud' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex h-screen" style={{ background: 'var(--hm-bg)' }} dir="ltr">
      <Toaster position="top-center" />

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            padding: 10,
            background: 'var(--hm-blue)',
            color: 'white',
            borderRadius: 12,
            border: 'none',
            boxShadow: 'var(--hm-shadow-md)',
            cursor: 'pointer',
          }}
        >
          {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-40 w-[260px] h-full transition-transform duration-200`}
        style={{
          background: 'white',
          borderRight: '1px solid var(--hm-border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--hm-blue), var(--hm-blue-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>🇮🇱</div>
            <span style={{
              fontFamily: '"Fraunces", serif',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--hm-text)',
              letterSpacing: '-0.02em',
            }}>Hebrew Master</span>
          </div>
        </div>

        {/* Level Badge */}
        <div style={{
          margin: '0 16px 16px',
          padding: '14px 16px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #F0F4F8 0%, #E8EEF4 100%)',
          border: '1px solid var(--hm-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: '"Frank Ruhl Libre", serif',
                fontSize: 20,
                color: 'var(--hm-blue)',
                direction: 'rtl',
              }}>{levelInfo.name}</span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--hm-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>Level {levelInfo.level}</span>
            </div>
            {userStreak > 0 && (
              <span style={{ fontSize: 13, fontWeight: 700, color: '#F97316' }}>
                🔥 {userStreak}
              </span>
            )}
          </div>
          <div className="hm-progress-bar">
            <div className="hm-progress-fill" style={{ width: `${levelInfo.progress * 100}%` }} />
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--hm-text-muted)',
            marginTop: 6,
            fontWeight: 500,
          }}>
            {userXP} XP {levelInfo.nextLevel && `· ${levelInfo.xpNeeded - levelInfo.xpInLevel} to ${levelInfo.nextLevel}`}
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '0 12px', overflow: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {links.map((link) => {
              const isActive = link.match(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--hm-blue)' : 'var(--hm-text-secondary)',
                    background: isActive ? 'var(--hm-blue-pale)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#F5F5F3';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User & Logout */}
        <div style={{ padding: 16, borderTop: '1px solid var(--hm-border)' }}>
          {userEmail && (
            <div style={{
              fontSize: 12,
              color: 'var(--hm-text-muted)',
              marginBottom: 8,
              padding: '0 8px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>{userEmail}</div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'none',
              border: 'none',
              color: 'var(--hm-text-muted)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#EF4444';
              e.currentTarget.style.background = '#FEF2F2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--hm-text-muted)';
              e.currentTarget.style.background = 'none';
            }}
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto" style={{ background: 'var(--hm-bg)' }}>
        {children}
      </main>
    </div>
  );
}
