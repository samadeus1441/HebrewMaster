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
        .select('xp, streak, display_name')
        .eq('id', user.id)
        .single();

      setUserName(profile?.display_name || user.email?.split('@')[0] || 'Student');

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
    <div style={{ padding: '32px 28px', maxWidth: 900, margin: '0 auto' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Fraunces", serif',
          fontSize: 32,
          fontWeight: 700,
          color: 'var(--hm-text)',
          marginBottom: 4,
        }}>
          שלום, {userName} 👋
        </h1>
        <p style={{ color: 'var(--hm-text-secondary)', fontSize: 15 }}>
          {stats.dueCards > 0
            ? `You have ${stats.dueCards} cards waiting for review`
            : "You're all caught up! Great work."
          }
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 28,
      }}>
        {[
          { value: stats.lessonsCompleted, label: 'Lessons', icon: '📚' },
          { value: stats.wordsLearned, label: 'Words Learned', icon: '📝' },
          { value: stats.mastered, label: 'Mastered', icon: '⭐' },
          { value: stats.streak > 0 ? `🔥 ${stats.streak}` : '—', label: 'Day Streak', icon: '' },
        ].map((stat, i) => (
          <div key={i} className="hm-card" style={{ padding: '18px 16px', textAlign: 'center' }}>
            <div style={{
              fontFamily: '"Fraunces", serif',
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--hm-text)',
              lineHeight: 1.2,
            }}>
              {stat.icon && typeof stat.value === 'number' ? `${stat.icon} ${stat.value}` : stat.value}
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--hm-text-muted)',
              marginTop: 4,
            }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Due Cards CTA */}
      {stats.dueCards > 0 && (
        <Link href="/dashboard/practice" style={{ textDecoration: 'none' }}>
          <div className="hm-card hm-card-lift" style={{
            padding: '20px 24px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, var(--hm-blue) 0%, var(--hm-blue-light) 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                🃏 {stats.dueCards} cards due for review
              </div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Practice now to keep your streak alive</div>
            </div>
            <div style={{ fontSize: 28 }}>→</div>
          </div>
        </Link>
      )}

      {/* Recent Lessons */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <h2 style={{
            fontFamily: '"Fraunces", serif',
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--hm-text)',
          }}>Recent Lessons</h2>
          <Link href="/dashboard/lessons" style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--hm-blue)',
            textDecoration: 'none',
          }}>View all →</Link>
        </div>

        {recentLessons.length === 0 ? (
          <div className="hm-card" style={{
            padding: '40px 24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
            <p style={{ color: 'var(--hm-text-secondary)', fontSize: 14 }}>
              Your lesson history will appear here after your first lesson.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentLessons.map((lesson) => (
              <Link key={lesson.id} href="/dashboard/lessons" style={{ textDecoration: 'none' }}>
                <div className="hm-card" style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, var(--hm-blue), var(--hm-blue-light))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Fraunces", serif',
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>{lesson.lesson_number}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--hm-text)',
                      marginBottom: 2,
                    }}>{lesson.topic_title || `Lesson ${lesson.lesson_number}`}</div>
                    <div style={{
                      fontSize: 12,
                      color: 'var(--hm-text-muted)',
                      display: 'flex',
                      gap: 8,
                    }}>
                      <span>{formatDate(lesson.lesson_date)}</span>
                      {lesson.talk_ratio_student && (
                        <span>· Talk: {lesson.talk_ratio_student}%{lesson.talk_ratio_student >= 50 ? ' 🟢' : lesson.talk_ratio_student >= 35 ? ' 🟡' : ' 🔴'}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ color: 'var(--hm-text-muted)', fontSize: 18 }}>›</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{
          fontFamily: '"Fraunces", serif',
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--hm-text)',
          marginBottom: 16,
        }}>Quick Actions</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
        }}>
          {[
            { href: '/dashboard/practice', icon: '🃏', label: 'Flashcards', desc: 'Review your words' },
            { href: '/dashboard/quiz', icon: '🎯', label: 'Quiz', desc: 'Test yourself' },
            { href: '/dashboard/conversations', icon: '💬', label: 'Conversations', desc: 'Practice speaking' },
            { href: '/dashboard/alphabet', icon: '🔤', label: 'Alphabet', desc: 'Reference guide' },
          ].map((action) => (
            <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
              <div className="hm-card hm-card-lift" style={{
                padding: '20px 18px',
                textAlign: 'center',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{action.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--hm-text)', marginBottom: 2 }}>{action.label}</div>
                <div style={{ fontSize: 12, color: 'var(--hm-text-muted)' }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
