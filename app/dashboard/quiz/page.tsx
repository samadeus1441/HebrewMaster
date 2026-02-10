'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/app/context/LanguageContext';
import { XP_REWARDS } from '@/lib/xp-system';

interface Question {
  id: string;
  hebrew: string;
  transliteration?: string;
  correctAnswer: string;
  options: string[];
}

export default function QuizPage() {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cards } = await supabase
        .from('srs_cards')
        .select('*')
        .eq('user_id', user.id)
        .limit(10);

      if (!cards || cards.length < 4) {
        setLoading(false);
        return;
      }

      // Generate quiz questions
      const quizQuestions: Question[] = cards.slice(0, 10).map((card, index) => {
        // Get 3 random wrong answers
        const wrongAnswers = cards
          .filter(c => c.id !== card.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => c.back);

        // Combine and shuffle
        const options = [card.back, ...wrongAnswers].sort(() => Math.random() - 0.5);

        return {
          id: card.id,
          hebrew: card.front,
          transliteration: card.transliteration,
          correctAnswer: card.back,
          options,
        };
      });

      setQuestions(quizQuestions);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playSound = (type: 'correct' | 'wrong') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'correct') {
      // Success sound - cheerful beep
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      // Second beep
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1000;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.2);
      }, 100);
    } else {
      // Error sound - lower tone
      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    }
  };

  const awardXP = async (xpAmount: number) => {
    try {
      const response = await fetch('/api/award-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xpAmount }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSessionXP(prev => prev + xpAmount);
        
        if (data.leveledUp) {
          confetti({ particleCount: 300, spread: 120 });
          setTimeout(() => {
            alert(`🎉 LEVEL UP! You reached ${data.newLevel}!`);
          }, 500);
        }
      }
    } catch (error) {
      console.error('XP award error:', error);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (showResult) return;

    const correct = answer === questions[currentIndex].correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
      await awardXP(XP_REWARDS.QUIZ_CORRECT);
      playSound('correct');
      confetti({ particleCount: 50, spread: 60 });
    } else {
      await awardXP(XP_REWARDS.QUIZ_WRONG);
      playSound('wrong');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      setQuizComplete(true);
      confetti({ particleCount: 200, spread: 90 });
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSessionXP(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    fetchQuestions();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-slate-400">Loading quiz...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-4xl mb-4">📚</div>
        <div className="text-2xl font-bold text-slate-700">Not enough cards!</div>
        <div className="text-slate-500">Complete lessons to unlock quizzes</div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-12 shadow-2xl max-w-2xl w-full text-center"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-5xl font-black text-slate-900 mb-4">Quiz Complete!</h1>
          <div className="text-7xl font-black text-indigo-600 mb-2">
            {score}/{questions.length}
          </div>
          <div className="text-2xl text-slate-600 mb-8">{percentage}% Correct</div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
            <div className="text-3xl font-black text-slate-900">
              ⭐ +{sessionXP} XP Earned!
            </div>
          </div>

          <button
            onClick={restartQuiz}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-lg transition-all"
          >
            Take Another Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">🎯 Quiz Mode</h1>
              <p className="text-slate-600 mt-1">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-indigo-600">{score}</div>
              <div className="text-sm text-slate-500">Correct</div>
            </div>
          </div>
          
          {sessionXP > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="text-lg font-black text-slate-900">
                ⭐ Session XP: +{sessionXP}
              </div>
            </div>
          )}
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl p-12 shadow-2xl mb-8 text-center">
          <div className="text-7xl font-black text-slate-900 mb-4" dir="rtl">
            {currentQuestion.hebrew}
          </div>
          {currentQuestion.transliteration && (
            <div className="text-2xl text-indigo-600 italic font-semibold">
              {currentQuestion.transliteration}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentQuestion.correctAnswer;
            
            let bgColor = 'bg-white hover:bg-indigo-50 border-slate-200';
            if (showResult) {
              if (isCorrectAnswer) {
                bgColor = 'bg-green-100 border-green-400';
              } else if (isSelected && !isCorrect) {
                bgColor = 'bg-red-100 border-red-400';
              }
            } else if (isSelected) {
              bgColor = 'bg-indigo-100 border-indigo-400';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`${bgColor} border-2 rounded-2xl p-6 text-xl font-bold text-slate-900 transition-all shadow-lg disabled:cursor-not-allowed`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Result & Next Button */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className={`text-3xl font-black mb-6 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? `✅ Correct! +${XP_REWARDS.QUIZ_CORRECT} XP` : `❌ Wrong! +${XP_REWARDS.QUIZ_WRONG} XP`}
              </div>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-lg transition-all"
              >
                {currentIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz 🎉'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
