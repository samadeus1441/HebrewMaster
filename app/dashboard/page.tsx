'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useLanguage } from '@/app/context/LanguageContext';
import { getLevelFromXP } from '@/hooks/useGameification';

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ xp: 0, streak: 0, wordsLearned: 0, dueCards: 0, mastered: 0, lessonsCompleted: 0 });
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Student');
  const [userLanguages, setUserLanguages] = useState<string[]>([]);
  const [homeworkPending, setHomeworkPending] = useState(0);

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, streak, display_name, languages')
        .eq('id', user.id)
        .single();

      setUserName(profile?.display_name || user.email?.split('@')[0] || 'Student');
      setUserLanguages(profile?.languages || []);

      // Get SRS cards
      const { data: srsData } = await supabase
        .from('srs_cards')
        .select('*')
        .eq('user_id', user.id);

      const lessonCards = (srsData || []).filter(c => c.source === 'lesson');
      const dueCards = lessonCards.filter(c => new Date(c.due_date) <= new Date());
      const mastered = lessonCards.filter(c => c.stability >= 5);

      // Get lessons
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, lesson_number, topic_title, lesson_date, summary, talk_ratio_student, hebrew_percentage')
        .eq('student_user_id', user.id)
        .order('lesson_number', { ascending: false })
        .limit(3);

      setRecentLessons(lessons || []);

      // Get pending homework count
      const { count } = await supabase
        .from('homework')
        .select('*', { count: 'exact', head: true })
        .eq('student_user_id', user.id)
        .is('completed_at', null);

      setHomeworkPending(count || 0);

      setStats({
        xp: profile?.xp || 0,
        streak: profile?.streak || 0,
        wordsLearned: lessonCards.length,
        dueCards: dueCards.length,
        mastered: mastered.length,
        lessonsCompleted: lessons?.length || 0,
      });
    } catch (error) {
      console.error('Dashboard Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const levelInfo = getLevelFromXP(stats.xp);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid var(--hm-border)',
          borderTopColor: 'var(--hm-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960, margin: '0 auto' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: '"Fraunces", serif',
          fontSize: 32,
          fontWeight: 700,
          color: 'var(--hm-text)',
          marginBottom: 4,
        }}>
          {'\u{05E9}\u{05DC}\u{05D5}\u{05DD}'}, {userName}
        </h1>
        <p style={{ color: 'var(--hm-text-secondary)', fontSize: 15 }}>
          {stats.dueCards > 0
            ? `You have ${stats.dueCards} cards waiting for review`
            : homeworkPending > 0
              ? `You have ${homeworkPending} homework assignments pending`
              : "You're all caught up! Great work."
          }
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10,
        marginBottom: 24,
      }}>
        {[
          { value: stats.lessonsCompleted, label: 'Lessons', icon: '\uD83D\uDCDA' },
          { value: stats.wordsLearned, label: 'Words', icon: '\uD83D\uDCDD' },
          { value: stats.mastered, label: 'Mastered', icon: '\u2B50' },
          { value: stats.streak > 0 ? stats.streak : '\u2014', label: 'Streak', icon: '\uD83D\uDD25' },
          { value: `Lv ${levelInfo.level}`, label: `${stats.xp} XP`, icon: '\uD83C\uDF1F' },
        ].map((stat, i) => (
          <div key={i} className="hm-card" style={{ padding: '16px 14px', textAlign: 'center' }}>
            <div style={{
              fontFamily: '"Fraunces", serif',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--hm-text)',
              lineHeight: 1.2,
            }}>
              {stat.icon} {stat.value}
            </div>
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--hm-text-muted)',
              marginTop: 4,
            }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Urgent CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {stats.dueCards > 0 && (
          <Link href="/dashboard/practice" style={{ textDecoration: 'none' }}>
            <div className="hm-card hm-card-lift" style={{
              padding: '18px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, var(--hm-blue) 0%, var(--hm-blue-light) 100%)',
              color: 'white', border: 'none', cursor: 'pointer',
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
                  {stats.dueCards} cards due for review
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Practice now to keep your streak alive</div>
              </div>
              <div style={{ fontSize: 24 }}>{'\u2192'}</div>
            </div>
          </Link>
        )}
        {homeworkPending > 0 && (
          <Link href="/dashboard/homework" style={{ textDecoration: 'none' }}>
            <div className="hm-card hm-card-lift" style={{
              padding: '18px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #9BAB16 0%, #7a8c12 100%)',
              color: 'white', border: 'none', cursor: 'pointer',
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
                  {homeworkPending} homework pending
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Complete before your next lesson</div>
              </div>
              <div style={{ fontSize: 24 }}>{'\u2192'}</div>
            </div>
          </Link>
        )}
      </div>

      {/* ═══ PRACTICE TOOLS ═══ */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 600,
          color: 'var(--hm-text)', marginBottom: 14,
        }}>Practice Tools</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 12,
        }}>
          {[
            { href: '/dashboard/practice', icon: '\uD83C\uDCCF', label: 'Flashcards', desc: 'SRS review', badge: stats.dueCards > 0 ? `${stats.dueCards} due` : '' },
            { href: '/dashboard/quiz', icon: '\uD83C\uDFAF', label: 'Quiz', desc: 'Test yourself', badge: '' },
            { href: '/dashboard/reading', icon: '\uD83D\uDCD6', label: 'Reading', desc: 'Nikud toggle reader', badge: 'New' },
            { href: '/dashboard/conjugation', icon: '\u2699\uFE0F', label: 'Conjugation', desc: 'Binyanim drills', badge: 'New' },
            { href: '/dashboard/conversations', icon: '\uD83D\uDCAC', label: 'Conversations', desc: 'Practice speaking', badge: '' },
          ].map((action) => (
            <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
              <div className="hm-card hm-card-lift" style={{
                padding: '20px 16px', textAlign: 'center', cursor: 'pointer', position: 'relative',
              }}>
                {action.badge && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    padding: '2px 6px', borderRadius: 6,
                    background: action.badge === 'New' ? 'var(--hm-gold-light)' : 'var(--hm-red-light)',
                    color: action.badge === 'New' ? '#92400e' : 'var(--hm-red)',
                  }}>{action.badge}</span>
                )}
                <div style={{ fontSize: 30, marginBottom: 6 }}>{action.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--hm-text)', marginBottom: 2 }}>{action.label}</div>
                <div style={{ fontSize: 11, color: 'var(--hm-text-muted)' }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ LEARN & EXPLORE ═══ */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 600,
          color: 'var(--hm-text)', marginBottom: 14,
        }}>Learn &amp; Explore</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: 12,
        }}>
          {[
            { href: '/dashboard/roots', icon: '\uD83C\uDF33', label: 'Root Explorer', desc: 'Shoresh family trees', badge: 'New' },
            { href: '/dashboard/alphabet', icon: '\uD83D\uDD24', label: 'Alphabet', desc: 'Aleph-Bet reference', badge: '' },
            { href: '/dashboard/nikud', icon: '\u2721\uFE0F', label: 'Nikud Guide', desc: 'Vowel reference', badge: '' },
            { href: '/dashboard/lessons', icon: '\uD83D\uDCDA', label: 'My Lessons', desc: 'Lesson history', badge: '' },
            { href: '/dashboard/progress', icon: '\uD83D\uDCCA', label: 'Progress', desc: 'Skills & analytics', badge: 'New' },
          ].map((action) => (
            <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
              <div className="hm-card hm-card-lift" style={{
                padding: '20px 16px', textAlign: 'center', cursor: 'pointer', position: 'relative',
              }}>
                {action.badge && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    padding: '2px 6px', borderRadius: 6,
                    background: 'var(--hm-gold-light)', color: '#92400e',
                  }}>{action.badge}</span>
                )}
                <div style={{ fontSize: 30, marginBottom: 6 }}>{action.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--hm-text)', marginBottom: 2 }}>{action.label}</div>
                <div style={{ fontSize: 11, color: 'var(--hm-text-muted)' }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ HOMEWORK ═══ */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{
            fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 600, color: 'var(--hm-text)',
          }}>Homework</h2>
          <Link href="/dashboard/homework" style={{ fontSize: 13, fontWeight: 600, color: 'var(--hm-blue)', textDecoration: 'none' }}>
            View all {'\u2192'}
          </Link>
        </div>
        {homeworkPending === 0 ? (
          <div className="hm-card" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{'\u2705'}</div>
            <p style={{ color: 'var(--hm-text-secondary)', fontSize: 14 }}>
              No pending homework. Your tutor will assign practice after your next lesson.
            </p>
          </div>
        ) : (
          <Link href="/dashboard/homework" style={{ textDecoration: 'none' }}>
            <div className="hm-card hm-card-lift" style={{ padding: '20px 22px', cursor: 'pointer' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--hm-text)' }}>
                {homeworkPending} assignment{homeworkPending > 1 ? 's' : ''} waiting
              </p>
              <p style={{ fontSize: 12, color: 'var(--hm-text-muted)', marginTop: 4 }}>
                Complete homework before your next lesson for the best results.
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* ═══ RECENT LESSONS ═══ */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{
            fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 600, color: 'var(--hm-text)',
          }}>Recent Lessons</h2>
          <Link href="/dashboard/lessons" style={{ fontSize: 13, fontWeight: 600, color: 'var(--hm-blue)', textDecoration: 'none' }}>
            View all {'\u2192'}
          </Link>
        </div>
        {recentLessons.length === 0 ? (
          <div className="hm-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>{'\uD83D\uDCDA'}</div>
            <p style={{ color: 'var(--hm-text-secondary)', fontSize: 14 }}>
              Your lesson history will appear here after your first lesson.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentLessons.map((lesson) => (
              <Link key={lesson.id} href="/dashboard/lessons" style={{ textDecoration: 'none' }}>
                <div className="hm-card hm-card-lift" style={{
                  padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--hm-blue), var(--hm-blue-light))',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Fraunces", serif', fontSize: 17, fontWeight: 700, flexShrink: 0,
                  }}>{lesson.lesson_number}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--hm-text)', marginBottom: 2 }}>
                      {lesson.topic_title || `Lesson ${lesson.lesson_number}`}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--hm-text-muted)', display: 'flex', gap: 8 }}>
                      <span>{formatDate(lesson.lesson_date)}</span>
                      {lesson.talk_ratio_student && (
                        <span>Talk: {lesson.talk_ratio_student}%{lesson.talk_ratio_student >= 50 ? ' \uD83D\uDFE2' : lesson.talk_ratio_student >= 35 ? ' \uD83D\uDFE1' : ' \uD83D\uDD34'}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ color: 'var(--hm-text-muted)', fontSize: 18 }}>{'\u203A'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
