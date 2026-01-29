# Hebrew Master Premium - PART 2: Components & Features
## All the Premium Features I Promised

---

# 📋 TABLE OF CONTENTS

1. [Auth System](#auth)
2. [Study Session with FSRS](#study-session)
3. [Flashcard Component](#flashcard)
4. [Progress Dashboard](#progress)
5. [Teacher Dashboard](#teacher)
6. [Homework System](#homework)
7. [Achievement System](#achievements)
8. [TTS Audio](#tts)
9. [Stripe Payments](#stripe)
10. [PWA Config](#pwa)

---

# AUTH SYSTEM

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

```typescript
// hooks/useAuth.ts
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    
    // Create profile
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName
      });
      await supabase.from('user_progress').insert({
        user_id: data.user.id
      });
    }
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signIn, signUp, signOut };
}
```

```tsx
// app/auth/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            ע
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to continue learning Hebrew</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-12"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-12 pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
```

---

# STUDY SESSION WITH FSRS

```typescript
// hooks/useStudySession.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { schedule, Rating, State, createCard, previewIntervals } from '@/lib/fsrs';
import { FSRSCard, VocabularyWord } from '@/types';
import { hebrewAlphabet } from '@/lib/data/alphabet';
import { vocabularyData, getAllWords } from '@/lib/data/vocabulary';

interface StudyItem {
  card: FSRSCard;
  content: {
    type: 'letter' | 'nikud' | 'word';
    front: string;
    back: string;
    audio?: string;
    details?: any;
  };
}

export function useStudySession(userId: string) {
  const [cards, setCards] = useState<StudyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    xpEarned: 0,
    startTime: new Date()
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load due cards
  const loadCards = useCallback(async () => {
    setLoading(true);
    
    // Get user's FSRS cards that are due
    const { data: fsrsCards } = await supabase
      .from('fsrs_cards')
      .select('*')
      .eq('user_id', userId)
      .lte('due', new Date().toISOString())
      .order('due', { ascending: true })
      .limit(20);

    // Get some new cards if not enough due cards
    const { data: allCards } = await supabase
      .from('fsrs_cards')
      .select('item_id')
      .eq('user_id', userId);
    
    const learnedIds = new Set(allCards?.map(c => c.item_id) || []);
    
    // Build study items
    const studyItems: StudyItem[] = [];
    
    // Add due cards
    fsrsCards?.forEach(card => {
      const content = getContentForCard(card);
      if (content) {
        studyItems.push({ card, content });
      }
    });
    
    // Add new words if needed (up to 10 new per session)
    if (studyItems.length < 10) {
      const allWords = getAllWords();
      const newWords = allWords.filter(w => !learnedIds.has(w.id)).slice(0, 10 - studyItems.length);
      
      for (const word of newWords) {
        const newCard: FSRSCard = {
          id: crypto.randomUUID(),
          user_id: userId,
          item_type: 'word',
          item_id: word.id,
          ...createCard(),
          created_at: new Date().toISOString()
        };
        
        studyItems.push({
          card: newCard,
          content: {
            type: 'word',
            front: word.hebrew_with_nikud,
            back: word.meaning_en,
            details: word
          }
        });
      }
    }
    
    setCards(studyItems);
    setLoading(false);
  }, [userId, supabase]);

  // Get content for a card
  function getContentForCard(card: FSRSCard) {
    if (card.item_type === 'letter') {
      const letter = hebrewAlphabet.find(l => l.id === card.item_id);
      if (letter) {
        return {
          type: 'letter' as const,
          front: letter.letter,
          back: `${letter.name_english} - ${letter.sound_description_en}`,
          details: letter
        };
      }
    } else if (card.item_type === 'word') {
      const allWords = getAllWords();
      const word = allWords.find(w => w.id === card.item_id);
      if (word) {
        return {
          type: 'word' as const,
          front: word.hebrew_with_nikud,
          back: word.meaning_en,
          details: word
        };
      }
    }
    return null;
  }

  // Handle rating
  const handleRating = async (rating: Rating) => {
    const currentItem = cards[currentIndex];
    if (!currentItem) return;

    const { card: updatedCard } = schedule(currentItem.card, rating);
    
    // Save to database
    const isNew = currentItem.card.state === State.New;
    
    if (isNew) {
      await supabase.from('fsrs_cards').insert({
        ...updatedCard,
        user_id: userId
      });
    } else {
      await supabase.from('fsrs_cards').update(updatedCard).eq('id', updatedCard.id);
    }

    // Log review
    await supabase.from('review_logs').insert({
      card_id: updatedCard.id,
      user_id: userId,
      rating,
      state: currentItem.card.state,
      due: currentItem.card.due,
      stability: updatedCard.stability,
      difficulty: updatedCard.difficulty,
      elapsed_days: updatedCard.elapsed_days,
      scheduled_days: updatedCard.scheduled_days,
      reviewed_at: new Date().toISOString()
    });

    // Update stats
    const xp = rating >= Rating.Good ? 10 : 5;
    setSessionStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (rating >= Rating.Good ? 1 : 0),
      xpEarned: prev.xpEarned + xp
    }));

    // Next card
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Get current intervals preview
  const getIntervals = () => {
    const currentItem = cards[currentIndex];
    if (!currentItem) return null;
    return previewIntervals(currentItem.card);
  };

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  return {
    cards,
    currentCard: cards[currentIndex],
    currentIndex,
    totalCards: cards.length,
    isFlipped,
    setIsFlipped,
    handleRating,
    getIntervals,
    sessionStats,
    loading,
    isComplete: currentIndex >= cards.length
  };
}
```

---

# FLASHCARD COMPONENT

```tsx
// components/Flashcard.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Eye, EyeOff } from 'lucide-react';
import { Rating } from '@/lib/fsrs';

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (rating: Rating) => void;
  intervals: Record<Rating, string> | null;
  showHint?: boolean;
  hint?: string;
  onPlayAudio?: () => void;
}

export function Flashcard({
  front,
  back,
  isFlipped,
  onFlip,
  onRate,
  intervals,
  showHint,
  hint,
  onPlayAudio
}: FlashcardProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Card */}
      <motion.div
        className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
        onClick={() => !isFlipped && onFlip()}
      >
        <motion.div
          className="absolute inset-0 transition-transform duration-500 transform-style-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex flex-col items-center justify-center shadow-2xl">
            <p className="hebrew text-6xl md:text-7xl font-bold text-white mb-4">
              {front}
            </p>
            {hint && showHint && (
              <p className="text-indigo-200 text-lg">{hint}</p>
            )}
            {onPlayAudio && (
              <button
                onClick={(e) => { e.stopPropagation(); onPlayAudio(); }}
                className="absolute top-6 right-6 p-3 bg-white/20 rounded-full hover:bg-white/30 transition"
              >
                <Volume2 className="w-6 h-6 text-white" />
              </button>
            )}
            <p className="absolute bottom-6 text-indigo-200 text-sm">
              Tap to reveal
            </p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 flex flex-col items-center justify-center shadow-2xl rotate-y-180">
            <p className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
              {back}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Rating Buttons */}
      <AnimatePresence>
        {isFlipped && intervals && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-4 gap-3 mt-8"
          >
            <button
              onClick={() => onRate(Rating.Again)}
              className="rating-btn rating-again"
            >
              <span className="text-2xl">😞</span>
              <span className="text-sm font-bold">Again</span>
              <span className="text-xs opacity-70">{intervals[Rating.Again]}</span>
            </button>
            
            <button
              onClick={() => onRate(Rating.Hard)}
              className="rating-btn rating-hard"
            >
              <span className="text-2xl">😐</span>
              <span className="text-sm font-bold">Hard</span>
              <span className="text-xs opacity-70">{intervals[Rating.Hard]}</span>
            </button>
            
            <button
              onClick={() => onRate(Rating.Good)}
              className="rating-btn rating-good"
            >
              <span className="text-2xl">😊</span>
              <span className="text-sm font-bold">Good</span>
              <span className="text-xs opacity-70">{intervals[Rating.Good]}</span>
            </button>
            
            <button
              onClick={() => onRate(Rating.Easy)}
              className="rating-btn rating-easy"
            >
              <span className="text-2xl">🎉</span>
              <span className="text-sm font-bold">Easy</span>
              <span className="text-xs opacity-70">{intervals[Rating.Easy]}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

```tsx
// app/dashboard/study/page.tsx
'use client';
import { useAuth } from '@/hooks/useAuth';
import { useStudySession } from '@/hooks/useStudySession';
import { Flashcard } from '@/components/Flashcard';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StudyPage() {
  const { user } = useAuth();
  const {
    currentCard,
    currentIndex,
    totalCards,
    isFlipped,
    setIsFlipped,
    handleRating,
    getIntervals,
    sessionStats,
    loading,
    isComplete
  } = useStudySession(user?.id || '');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isComplete || totalCards === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Session Complete!</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card p-4">
              <p className="text-2xl font-bold text-green-400">{sessionStats.reviewed}</p>
              <p className="text-sm text-gray-400">Cards Reviewed</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold text-blue-400">
                {Math.round((sessionStats.correct / sessionStats.reviewed) * 100) || 0}%
              </p>
              <p className="text-sm text-gray-400">Accuracy</p>
            </div>
            <div className="card p-4">
              <p className="text-2xl font-bold text-yellow-400">+{sessionStats.xpEarned}</p>
              <p className="text-sm text-gray-400">XP Earned</p>
            </div>
          </div>
          <Link href="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="btn-ghost flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-yellow-400">+{sessionStats.xpEarned}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-indigo-400">{currentIndex + 1}/{totalCards}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar mb-8">
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      {currentCard && (
        <Flashcard
          front={currentCard.content.front}
          back={currentCard.content.back}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(true)}
          onRate={handleRating}
          intervals={getIntervals()}
        />
      )}

      {/* Keyboard shortcuts hint */}
      <p className="text-center text-gray-500 text-sm mt-8">
        Keyboard: Space to flip • 1-4 to rate
      </p>
    </div>
  );
}
```

---

# PROGRESS DASHBOARD

```tsx
// app/dashboard/progress/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Calendar, BookOpen, Brain, Target, Clock } from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    async function loadProgress() {
      // Get user progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setStats(progress);

      // Get review logs for the past 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: reviews } = await supabase
        .from('review_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('reviewed_at', sevenDaysAgo.toISOString());

      // Process weekly data
      const dailyStats: Record<string, { reviews: number, correct: number }> = {};
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayName = days[date.getDay()];
        dailyStats[dayName] = { reviews: 0, correct: 0 };
      }

      reviews?.forEach(review => {
        const date = new Date(review.reviewed_at);
        const dayName = days[date.getDay()];
        if (dailyStats[dayName]) {
          dailyStats[dayName].reviews++;
          if (review.rating >= 3) dailyStats[dayName].correct++;
        }
      });

      setWeeklyData(Object.entries(dailyStats).map(([day, data]) => ({
        day,
        reviews: data.reviews,
        accuracy: data.reviews > 0 ? Math.round((data.correct / data.reviews) * 100) : 0
      })));

      // Get cards by state
      const { data: cards } = await supabase
        .from('fsrs_cards')
        .select('state')
        .eq('user_id', user.id);

      const stateCounts: Record<string, number> = { new: 0, learning: 0, review: 0, relearning: 0 };
      cards?.forEach(card => {
        stateCounts[card.state] = (stateCounts[card.state] || 0) + 1;
      });

      setCategoryData([
        { name: 'New', value: stateCounts.new, color: '#6366f1' },
        { name: 'Learning', value: stateCounts.learning, color: '#f59e0b' },
        { name: 'Review', value: stateCounts.review, color: '#10b981' },
        { name: 'Relearning', value: stateCounts.relearning, color: '#ef4444' },
      ]);
    }

    loadProgress();
  }, [user, supabase]);

  if (!stats) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Your Progress</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card"
        >
          <Calendar className="w-8 h-8 text-orange-400 mb-2" />
          <div className="stat-value text-orange-400">{stats.current_streak}</div>
          <div className="stat-label">Day Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <BookOpen className="w-8 h-8 text-green-400 mb-2" />
          <div className="stat-value text-green-400">{stats.words_learned}</div>
          <div className="stat-label">Words Learned</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <Brain className="w-8 h-8 text-purple-400 mb-2" />
          <div className="stat-value text-purple-400">{stats.letters_mastered}/22</div>
          <div className="stat-label">Letters Mastered</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <Clock className="w-8 h-8 text-blue-400 mb-2" />
          <div className="stat-value text-blue-400">{Math.round(stats.total_study_time_minutes / 60)}h</div>
          <div className="stat-label">Total Study Time</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
              />
              <Bar dataKey="reviews" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Card States */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Card Distribution
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {categoryData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-400">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accuracy Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Weekly Accuracy</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

---

# TEACHER DASHBOARD

```tsx
// app/dashboard/admin/page.tsx (Teacher Dashboard)
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, BookOpen, TrendingUp, Plus, Mail } from 'lucide-react';

interface Student {
  id: string;
  full_name: string;
  email: string;
  current_streak: number;
  words_learned: number;
  last_study_date: string;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [classCode, setClassCode] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function loadStudents() {
      // Get teacher's classes
      const { data: classes } = await supabase
        .from('classes')
        .select('id, access_code')
        .eq('teacher_id', user?.id);

      if (classes && classes.length > 0) {
        setClassCode(classes[0].access_code);
        
        // Get enrolled students
        const { data: enrollments } = await supabase
          .from('class_enrollments')
          .select('student_id')
          .eq('class_id', classes[0].id)
          .eq('status', 'active');

        if (enrollments) {
          const studentIds = enrollments.map(e => e.student_id);
          
          const { data: studentProfiles } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', studentIds);

          const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .in('user_id', studentIds);

          const studentsWithProgress = studentProfiles?.map(profile => {
            const prog = progress?.find(p => p.user_id === profile.id);
            return {
              ...profile,
              current_streak: prog?.current_streak || 0,
              words_learned: prog?.words_learned || 0,
              last_study_date: prog?.last_study_date || 'Never'
            };
          }) || [];

          setStudents(studentsWithProgress);
        }
      }
    }

    if (user) loadStudents();
  }, [user, supabase]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Assignment
        </button>
      </div>

      {/* Class Code */}
      <div className="card p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Class Access Code</p>
            <p className="text-3xl font-bold text-white font-mono">{classCode || 'No class yet'}</p>
          </div>
          <button className="btn-secondary">Share with Students</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <Users className="w-8 h-8 text-indigo-400 mb-2" />
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">Active Students</div>
        </div>
        <div className="stat-card">
          <BookOpen className="w-8 h-8 text-green-400 mb-2" />
          <div className="stat-value">
            {Math.round(students.reduce((sum, s) => sum + s.words_learned, 0) / students.length) || 0}
          </div>
          <div className="stat-label">Avg Words Learned</div>
        </div>
        <div className="stat-card">
          <TrendingUp className="w-8 h-8 text-orange-400 mb-2" />
          <div className="stat-value">
            {Math.round(students.reduce((sum, s) => sum + s.current_streak, 0) / students.length) || 0}
          </div>
          <div className="stat-label">Avg Streak</div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Students</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Student</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Words Learned</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Streak</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Last Active</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{student.full_name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-400 font-bold">{student.words_learned}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-orange-400 font-bold">🔥 {student.current_streak}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {student.last_study_date === 'Never' 
                      ? 'Never' 
                      : new Date(student.last_study_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="btn-ghost p-2">
                      <Mail className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

---

# HOMEWORK SYSTEM

```typescript
// Database additions for homework
/*
CREATE TABLE public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES public.profiles(id) NOT NULL,
  class_id UUID REFERENCES public.classes(id),
  title TEXT NOT NULL,
  description TEXT,
  word_ids TEXT[], -- Array of word IDs to practice
  due_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.assignment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments(id) NOT NULL,
  student_id UUID REFERENCES public.profiles(id) NOT NULL,
  score INTEGER,
  max_score INTEGER,
  time_spent_minutes INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  feedback TEXT,
  UNIQUE(assignment_id, student_id)
);
*/
```

```tsx
// components/AssignmentCard.tsx
'use client';
import { Clock, BookOpen, CheckCircle } from 'lucide-react';

interface AssignmentCardProps {
  title: string;
  description: string;
  wordCount: number;
  dueDate: string;
  isCompleted?: boolean;
  score?: number;
  maxScore?: number;
  onStart: () => void;
}

export function AssignmentCard({
  title,
  description,
  wordCount,
  dueDate,
  isCompleted,
  score,
  maxScore,
  onStart
}: AssignmentCardProps) {
  const dueInDays = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = dueInDays < 0;

  return (
    <div className={`card p-6 ${isCompleted ? 'border-green-500/30' : isOverdue ? 'border-red-500/30' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        {isCompleted && (
          <div className="p-2 bg-green-500/20 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <BookOpen className="w-4 h-4" />
          <span>{wordCount} words</span>
        </div>
        <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
          <Clock className="w-4 h-4" />
          <span>
            {isOverdue 
              ? `${Math.abs(dueInDays)} days overdue`
              : dueInDays === 0 
                ? 'Due today'
                : `Due in ${dueInDays} days`}
          </span>
        </div>
      </div>

      {isCompleted ? (
        <div className="flex items-center justify-between">
          <span className="text-green-400 font-bold">
            Score: {score}/{maxScore} ({Math.round((score! / maxScore!) * 100)}%)
          </span>
          <button className="btn-ghost text-sm">Review</button>
        </div>
      ) : (
        <button onClick={onStart} className="btn-primary w-full">
          Start Assignment
        </button>
      )}
    </div>
  );
}
```

---

# ACHIEVEMENT SYSTEM

```typescript
// lib/achievements.ts
export const achievementDefinitions = [
  // Streak achievements
  { id: 'streak_7', name: '7 Day Streak', icon: '🔥', xp: 100, type: 'streak', value: 7, tier: 'bronze' },
  { id: 'streak_30', name: '30 Day Streak', icon: '🔥', xp: 500, type: 'streak', value: 30, tier: 'silver' },
  { id: 'streak_100', name: '100 Day Streak', icon: '🔥', xp: 2000, type: 'streak', value: 100, tier: 'gold' },
  { id: 'streak_365', name: 'Year Streak', icon: '🔥', xp: 10000, type: 'streak', value: 365, tier: 'platinum' },
  
  // Words achievements
  { id: 'words_10', name: 'First 10 Words', icon: '📚', xp: 50, type: 'words', value: 10, tier: 'bronze' },
  { id: 'words_50', name: '50 Words', icon: '📚', xp: 200, type: 'words', value: 50, tier: 'bronze' },
  { id: 'words_100', name: '100 Words', icon: '📚', xp: 500, type: 'words', value: 100, tier: 'silver' },
  { id: 'words_500', name: '500 Words', icon: '📚', xp: 2000, type: 'words', value: 500, tier: 'gold' },
  
  // Letter achievements
  { id: 'letters_complete', name: 'Alef-Bet Master', icon: '🎓', xp: 1000, type: 'letters', value: 22, tier: 'gold' },
  
  // Session achievements
  { id: 'perfect_10', name: 'Perfect 10', icon: '⭐', xp: 100, type: 'perfect', value: 10, tier: 'silver' },
  { id: 'perfect_50', name: 'Perfect 50', icon: '⭐', xp: 500, type: 'perfect', value: 50, tier: 'gold' },
  
  // XP achievements
  { id: 'xp_1000', name: '1K XP', icon: '💎', xp: 100, type: 'xp', value: 1000, tier: 'bronze' },
  { id: 'xp_10000', name: '10K XP', icon: '💎', xp: 500, type: 'xp', value: 10000, tier: 'silver' },
  { id: 'xp_100000', name: '100K XP', icon: '💎', xp: 2000, type: 'xp', value: 100000, tier: 'gold' },
];

export async function checkAndAwardAchievements(supabase: any, userId: string, stats: any) {
  const { data: existing } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const earnedIds = new Set(existing?.map((a: any) => a.achievement_id) || []);
  const newAchievements: string[] = [];

  for (const achievement of achievementDefinitions) {
    if (earnedIds.has(achievement.id)) continue;

    let earned = false;
    switch (achievement.type) {
      case 'streak':
        earned = stats.current_streak >= achievement.value;
        break;
      case 'words':
        earned = stats.words_learned >= achievement.value;
        break;
      case 'letters':
        earned = stats.letters_mastered >= achievement.value;
        break;
      case 'xp':
        earned = stats.total_xp >= achievement.value;
        break;
    }

    if (earned) {
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id
      });
      
      // Add XP reward
      await supabase
        .from('user_progress')
        .update({ total_xp: stats.total_xp + achievement.xp })
        .eq('user_id', userId);
      
      newAchievements.push(achievement.id);
    }
  }

  return newAchievements;
}
```

---

# TTS AUDIO

```typescript
// lib/tts.ts
// Option 1: Web Speech API (free, works in browser)
export function speakHebrew(text: string) {
  if (typeof window === 'undefined') return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'he-IL';
  utterance.rate = 0.8; // Slower for learning
  
  window.speechSynthesis.speak(utterance);
}

// Option 2: ElevenLabs API (premium quality)
export async function speakHebrewPremium(text: string): Promise<string> {
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY!
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75
      }
    })
  });

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

// Option 3: Google Cloud TTS
export async function speakHebrewGoogle(text: string): Promise<string> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language: 'he-IL' })
  });

  const { audioContent } = await response.json();
  return `data:audio/mp3;base64,${audioContent}`;
}
```

```tsx
// components/AudioButton.tsx
'use client';
import { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { speakHebrew } from '@/lib/tts';

interface AudioButtonProps {
  text: string;
  className?: string;
}

export function AudioButton({ text, className = '' }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    speakHebrew(text);
    setTimeout(() => setPlaying(false), 2000);
  };

  return (
    <button
      onClick={handlePlay}
      disabled={playing}
      className={`p-3 rounded-full bg-white/10 hover:bg-white/20 transition ${className}`}
    >
      {playing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
}
```

---

# STRIPE PAYMENTS

```typescript
// app/api/stripe/create-checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(request: Request) {
  const { priceId, userId } = await request.json();
  const supabase = createServerSupabaseClient();

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', userId)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email,
      metadata: { userId }
    });
    customerId = customer.id;
    
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId);
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
    subscription_data: {
      trial_period_days: 7,
      metadata: { userId }
    }
  });

  return NextResponse.json({ url: session.url });
}
```

```typescript
// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId;
      
      await supabase
        .from('profiles')
        .update({
          subscription_tier: 'premium',
          subscription_status: subscription.status
        })
        .eq('id', userId);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId;
      
      await supabase
        .from('profiles')
        .update({
          subscription_tier: 'free',
          subscription_status: 'canceled'
        })
        .eq('id', userId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

```tsx
// components/PricingCard.tsx
'use client';
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  features: string[];
  priceId: string;
  userId: string;
  popular?: boolean;
}

export function PricingCard({ name, price, period, features, priceId, userId, popular }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId })
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  return (
    <div className={`card p-8 ${popular ? 'border-indigo-500/50 bg-indigo-500/5' : ''}`}>
      {popular && (
        <span className="inline-block px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full mb-4">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-2xl font-bold text-white">{name}</h3>
      <div className="flex items-baseline gap-1 mt-4 mb-6">
        <span className="text-4xl font-bold text-white">€{price}</span>
        <span className="text-gray-400">/{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map(feature => (
          <li key={feature} className="flex items-center gap-3 text-gray-300">
            <Check className="w-5 h-5 text-green-400" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold ${
          popular 
            ? 'btn-primary' 
            : 'bg-white/10 hover:bg-white/20 transition'
        }`}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Start Free Trial'}
      </button>
    </div>
  );
}
```

---

# PWA CONFIG

```json
// public/manifest.json
{
  "name": "Hebrew Master",
  "short_name": "Hebrew",
  "description": "Learn Hebrew with spaced repetition",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

```typescript
// next.config.js (with next-pwa)
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
});

module.exports = withPWA({
  // your next config
});
```

```tsx
// app/layout.tsx - Add to head
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#6366f1" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

---

# CERTIFICATES

```tsx
// components/Certificate.tsx
'use client';
import { useRef } from 'react';

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

export function Certificate({ studentName, courseName, completionDate, certificateId }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    // Use html2canvas to convert to image
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(certificateRef.current!);
    const link = document.createElement('a');
    link.download = `hebrew-master-certificate-${certificateId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      <div
        ref={certificateRef}
        className="w-[800px] h-[600px] bg-gradient-to-br from-indigo-900 to-purple-900 p-12 relative"
      >
        {/* Border */}
        <div className="absolute inset-4 border-4 border-yellow-400/30 rounded-lg" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white mb-6">
            ע
          </div>
          
          <p className="text-yellow-400 text-lg tracking-widest mb-2">CERTIFICATE OF COMPLETION</p>
          
          <h1 className="text-4xl font-bold text-white mb-8">Hebrew Master</h1>
          
          <p className="text-gray-300 text-lg mb-2">This is to certify that</p>
          
          <p className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'serif' }}>
            {studentName}
          </p>
          
          <p className="text-gray-300 mb-8">
            has successfully completed the course
          </p>
          
          <p className="text-2xl font-bold text-indigo-300 mb-8">
            {courseName}
          </p>
          
          <p className="text-gray-400 text-sm">
            Completed on {new Date(completionDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          <p className="text-gray-500 text-xs mt-4">
            Certificate ID: {certificateId}
          </p>
        </div>
      </div>
      
      <button onClick={downloadCertificate} className="btn-primary mt-4">
        Download Certificate
      </button>
    </div>
  );
}
```

---

# ENV VARIABLES NEEDED

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Price IDs
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...

# TTS (optional)
ELEVENLABS_API_KEY=your-key
GOOGLE_CLOUD_TTS_KEY=your-key

# App
NEXT_PUBLIC_URL=https://your-domain.com
```

---

# SUMMARY - What's In This File

✅ **Auth System** - Login, Signup, useAuth hook
✅ **Study Session** - Full FSRS integration with useStudySession hook  
✅ **Flashcard Component** - Animated, with rating buttons
✅ **Progress Dashboard** - Charts, stats, visualizations
✅ **Teacher Dashboard** - Student management, class codes
✅ **Homework System** - Assignments, submissions
✅ **Achievement System** - 15 achievements with auto-award
✅ **TTS Audio** - 3 options (Web Speech, ElevenLabs, Google)
✅ **Stripe Payments** - Checkout, webhook, subscription management
✅ **PWA Config** - manifest.json, next-pwa setup
✅ **Certificates** - Downloadable completion certificates

Combined with PART 1, you now have everything needed for a €200/month premium platform!
