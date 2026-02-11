'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameification, XP_REWARDS, playSound, fireConfetti } from '@/hooks/useGameification'
import { XPToast, LevelUpModal, SessionComplete } from '@/components/GameUI'

interface Question {
  id: string; hebrew: string; transliteration?: string;
  correctAnswer: string; options: string[];
}

export default function QuizPage() {
  const { awardXP, xpToast, levelUp, dismissLevelUp } = useGameification()
  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [sessionXP, setSessionXP] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const [lessons, setLessons] = useState<any[]>([])
  const [selectedLesson, setSelectedLesson] = useState('all')

  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: cards } = await supabase.from('srs_cards').select('*').eq('user_id', user.id)
    const { data: lsns } = await supabase.from('lessons')
      .select('lesson_number, lesson_date, topic_title, vocabulary')
      .eq('student_user_id', user.id).order('lesson_number', { ascending: false })
    setLessons(lsns || [])
    generateQuestions(cards || [], 'all', lsns || [])
    setLoading(false)
  }

  const generateQuestions = (cards: any[], filter: string, lsns: any[]) => {
    let pool = cards
    if (filter !== 'all') {
      const lesson = lsns.find((l: any) => l.lesson_number.toString() === filter)
      if (lesson?.vocabulary) {
        const words = lesson.vocabulary.map((v: any) => v.front)
        pool = cards.filter(c => words.includes(c.front))
      }
    }
    if (pool.length < 4) { setQuestions([]); return }
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10)
    const qs: Question[] = shuffled.map(card => {
      const wrongs = pool.filter(c => c.id !== card.id).sort(() => Math.random() - 0.5).slice(0, 3).map(c => c.back)
      return {
        id: card.id, hebrew: card.front, transliteration: card.transliteration,
        correctAnswer: card.back,
        options: [card.back, ...wrongs].sort(() => Math.random() - 0.5),
      }
    })
    setQuestions(qs)
    setIdx(0); setScore(0); setSessionXP(0); setSelected(null); setShowResult(false); setDone(false)
  }

  const handleFilter = (val: string) => {
    setSelectedLesson(val)
    const { } = supabase // just to access cards again
    // Re-fetch and regenerate
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('srs_cards').select('*').eq('user_id', user.id).then(({ data }) => {
        generateQuestions(data || [], val, lessons)
      })
    })
  }

  const answer = async (option: string) => {
    if (showResult) return
    const isCorrect = option === questions[idx].correctAnswer
    setSelected(option); setCorrect(isCorrect); setShowResult(true)

    if (isCorrect) {
      setScore(s => s + 1)
      playSound('correct')
      fireConfetti('light')
      await awardXP(XP_REWARDS.QUIZ_CORRECT)
      setSessionXP(p => p + XP_REWARDS.QUIZ_CORRECT)
    } else {
      playSound('wrong')
      await awardXP(XP_REWARDS.QUIZ_WRONG)
      setSessionXP(p => p + XP_REWARDS.QUIZ_WRONG)
    }
  }

  const next = () => {
    if (idx < questions.length - 1) {
      setIdx(idx + 1); setSelected(null); setShowResult(false); setCorrect(false)
    } else {
      fireConfetti('medium')
      setDone(true)
    }
  }

  const restart = () => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('srs_cards').select('*').eq('user_id', user.id).then(({ data }) => {
        generateQuestions(data || [], selectedLesson, lessons)
      })
    })
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #E5E5E0', borderTopColor: '#1E3A5F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (questions.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center', padding: 32 }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
      <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Not enough cards for a quiz</h1>
      <p style={{ color: '#6B7280', fontSize: 15 }}>You need at least 4 vocabulary words. Keep learning!</p>
    </div>
  )

  if (done) return (
    <>
      <XPToast amount={xpToast.amount} visible={xpToast.visible} />
      <AnimatePresence>{levelUp && <LevelUpModal {...levelUp} onDismiss={dismissLevelUp} />}</AnimatePresence>
      <SessionComplete score={score} total={questions.length} xpEarned={sessionXP} onRestart={restart} onExit={() => window.location.href = '/dashboard'} />
    </>
  )

  const q = questions[idx]
  const progress = ((idx + 1) / questions.length) * 100

  return (
    <div style={{ padding: '24px 20px', maxWidth: 640, margin: '0 auto' }}>
      <XPToast amount={xpToast.amount} visible={xpToast.visible} />
      <AnimatePresence>{levelUp && <LevelUpModal {...levelUp} onDismiss={dismissLevelUp} />}</AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 24, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>Quiz</h1>
          <span style={{ fontSize: 13, color: '#9CA3AF' }}>Question {idx + 1} of {questions.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 800, color: '#1E3A5F',
          }}>{score}<span style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 500 }}>/{idx + (showResult ? 1 : 0)}</span></span>
          <select
            value={selectedLesson}
            onChange={e => handleFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #E5E5E0', fontSize: 13, fontWeight: 600, color: '#1A1A2E', background: 'white', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">All lessons</option>
            {lessons.map(l => (
              <option key={l.lesson_number} value={l.lesson_number}>
                {l.topic_title || `Lesson ${l.lesson_number}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 4, borderRadius: 2, background: '#E5E5E0', marginBottom: 32, overflow: 'hidden' }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #1E3A5F, #2D5F8A)' }} />
      </div>

      {/* Question card */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white', borderRadius: 20, padding: '44px 32px',
          border: '1px solid #E5E5E0', boxShadow: '0 2px 8px rgba(26,26,46,0.06), 0 12px 40px rgba(26,26,46,0.04)',
          textAlign: 'center', marginBottom: 24,
        }}
      >
        <div style={{
          fontFamily: '"Frank Ruhl Libre", serif', fontSize: 48, fontWeight: 700,
          color: '#1A1A2E', direction: 'rtl', marginBottom: 10, lineHeight: 1.2,
        }}>{q.hebrew}</div>
        {q.transliteration && (
          <div style={{ fontSize: 17, color: '#6B7280', fontStyle: 'italic' }}>{q.transliteration}</div>
        )}
      </motion.div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === opt
          const isRight = opt === q.correctAnswer

          let bg = 'white'
          let border = '#E5E5E0'
          let color = '#1A1A2E'
          if (showResult) {
            if (isRight) { bg = '#D1FAE5'; border = '#6EE7B7'; color = '#065F46' }
            else if (isSelected && !correct) { bg = '#FFF7ED'; border = '#FDBA74'; color = '#9A3412' }  // Warm orange, NOT red — Unlearning philosophy
          }

          return (
            <motion.button
              key={i}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => answer(opt)}
              disabled={showResult}
              style={{
                background: bg, border: `2px solid ${border}`, borderRadius: 14,
                padding: '20px 16px', fontSize: 16, fontWeight: 600, color,
                cursor: showResult ? 'default' : 'pointer', textAlign: 'center',
                transition: 'all 0.15s',
              }}
            >
              {opt}
            </motion.button>
          )
        })}
      </div>

      {/* Result + Next */}
      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 18, fontWeight: 700, marginBottom: 16,
              color: correct ? '#065F46' : '#9A3412',  // Green or warm orange — never aggressive red
            }}>
              {correct
                ? `✓ Correct! +${XP_REWARDS.QUIZ_CORRECT} XP`
                : `Almost! The answer was "${q.correctAnswer}"`  // Encouraging, not punishing
              }
            </div>
            <button onClick={next} className="hm-btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
              {idx < questions.length - 1 ? 'Next →' : 'See Results'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
