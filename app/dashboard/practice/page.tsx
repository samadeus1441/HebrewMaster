'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/app/context/LanguageContext';

interface Card {
  id: string;
  front: string;
  back: string;
  transliteration?: string;
  source?: string;
  stability: number;
  difficulty: number;
  state: number;
  reps: number;
}

export default function PracticePage() {
  const { t } = useLanguage();
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all cards
      const { data: cardsData } = await supabase
        .from('srs_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setAllCards(cardsData || []);
      setFilteredCards(cardsData || []);

      // Fetch lessons
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('lesson_number, lesson_date, vocabulary')
        .eq('student_user_id', user.id)
        .order('lesson_number', { ascending: false });

      setLessons(lessonsData || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonFilter = (lessonNum: string) => {
    setSelectedLesson(lessonNum);
    setCurrentIndex(0);
    setIsFlipped(false);

    if (lessonNum === 'all') {
      setFilteredCards(allCards);
      return;
    }

    const lesson = lessons.find(l => l.lesson_number.toString() === lessonNum);
    if (!lesson) return;

    const lessonWords = lesson.vocabulary.map((v: any) => v.front);
    const filtered = allCards.filter(card => lessonWords.includes(card.front));
    setFilteredCards(filtered);
  };

  const playAudio = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const handleRating = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      confetti({ particleCount: 200, spread: 90 });
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-slate-400">Loading...</div>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-4xl mb-4">📚</div>
        <div className="text-2xl font-bold text-slate-700">No cards yet!</div>
        <div className="text-slate-500">Complete a lesson to start practicing</div>
      </div>
    );
  }

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Filter */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">🃏 Flashcards</h1>
              <p className="text-slate-600 mt-1">
                Card {currentIndex + 1} of {filteredCards.length}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Filter by lesson:</label>
              <select
                value={selectedLesson}
                onChange={(e) => handleLessonFilter(e.target.value)}
                className="px-6 py-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">📚 All Lessons ({allCards.length} cards)</option>
                {lessons.map((lesson) => (
                  <option key={lesson.lesson_number} value={lesson.lesson_number}>
                    Lesson {lesson.lesson_number} - {new Date(lesson.lesson_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <motion.div
          className="relative w-full h-96 mb-8 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isFlipped ? 'back' : 'front'}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border-4 border-indigo-100"
            >
              {!isFlipped ? (
                <>
                  <div className="text-7xl font-black text-slate-900 mb-4" dir="rtl">
                    {currentCard.front}
                  </div>
                  {currentCard.transliteration && (
                    <div className="text-2xl text-indigo-600 italic font-semibold">
                      {currentCard.transliteration}
                    </div>
                  )}
                  <div className="mt-8 text-slate-400 text-sm">Tap to reveal</div>
                </>
              ) : (
                <>
                  <div className="text-5xl font-bold text-slate-700 mb-4">
                    {currentCard.back}
                  </div>
                  <div className="text-3xl text-slate-900 mb-6" dir="rtl">
                    {currentCard.front}
                  </div>
                  {currentCard.transliteration && (
                    <div className="text-xl text-indigo-600 italic">
                      {currentCard.transliteration}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Audio Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              playAudio(currentCard.front);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center gap-3"
          >
            🔊 Listen
          </button>
        </div>

        {/* Rating Buttons */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <button
              onClick={handleRating}
              className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-2xl font-bold shadow-lg transition-all"
            >
              Again
            </button>
            <button
              onClick={handleRating}
              className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-2xl font-bold shadow-lg transition-all"
            >
              Hard
            </button>
            <button
              onClick={handleRating}
              className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-2xl font-bold shadow-lg transition-all"
            >
              Good
            </button>
            <button
              onClick={handleRating}
              className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-2xl font-bold shadow-lg transition-all"
            >
              Easy
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
