'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/LanguageContext'
import { useGameification, XP_REWARDS, playSound, fireConfetti } from '@/hooks/useGameification'
import { XPToast, LevelUpModal, SessionComplete } from '@/components/GameUI'

interface Card {
  id: string; front: string; back: string;
  transliteration?: string; category?: string;
  stability: number; difficulty: number; reps: number;
}

export default function PracticePage() {
  const { t } = useLanguage()
  const { awardXP, xpToast, levelUp, dismissLevelUp } = useGameification()
  const [allCards, setAllCards] = useState<Card[]>([])
  const [deck, setDeck] = useState<Card[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [selectedLesson, setSelectedLesson] = useState('all')
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionXP, setSessionXP] = useState(0)
  const [sessionScore, setSessionScore] = useState({ good: 0, total: 0 })
  const [done, setDone] = useState(false)

  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: cards } = await supabase
      .from('srs_cards').select('*').eq('user_id', user.id)
      .order('due_date', { ascending: true })
    const { data: lsns } = await supabase
      .from('lessons').select('lesson_number, lesson_date, topic_title, vocabulary')
      .eq('student_user_id', user.id).order('lesson_number', { ascending: false })
    setAllCards(cards || [])
    setDeck(cards || [])
    setLessons(lsns || [])
    setLoading(false)
  }

  const filterLesson = (val: string) => {
    setSelectedLesson(val)
    setIdx(0); setFlipped(false); setDone(false)
    if (val === 'all') { setDeck(allCards); return }
    const lesson = lessons.find(l => l.lesson_number.toString() === val)
    if (!lesson?.vocabulary) return
    const words = lesson.vocabulary.map((v: any) => v.front)
    setDeck(allCards.filter(c => words.includes(c.front)))
  }

  const flip = () => { setFlipped(!flipped); playSound('flip') }

  const playAudio = (text: string) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'he-IL'; u.rate = 0.85
    window.speechSynthesis.speak(u)
  }

  const rate = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const xpMap = { again: XP_REWARDS.FLASHCARD_AGAIN, hard: XP_REWARDS.FLASHCARD_HARD, good: XP_REWARDS.FLASHCARD_GOOD, easy: XP_REWARDS.FLASHCARD_EASY }
    const xp = xpMap[rating]
    const isGood = rating === 'good' || rating === 'easy'

    if (isGood) playSound('correct')
    else if (rating === 'again') playSound('wrong')

    await awardXP(xp)
    setSessionXP(p => p + xp)
    setSessionScore(p => ({ good: p.good + (isGood ? 1 : 0), total: p.total + 1 }))

    if (idx < deck.length - 1) {
      setIdx(idx + 1)
      setFlipped(false)
    } else {
      fireConfetti('medium')
      await awardXP(XP_REWARDS.SESSION_COMPLETE)
      setSessionXP(p => p + XP_REWARDS.SESSION_COMPLETE)
      setDone(true)
    }
  }

  const restart = () => {
    setIdx(0); setFlipped(false); setDone(false)
    setSessionXP(0); setSessionScore({ good: 0, total: 0 })
    // Reshuffle
    setDeck([...deck].sort(() => Math.random() - 0.5))
  }

  // Loading
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #E5E5E0', borderTopColor: '#1E3A5F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  // Empty
  if (deck.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center', padding: 32 }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🃏</div>
      <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>No cards yet</h1>
      <p style={{ color: '#6B7280', fontSize: 15 }}>Complete a lesson to start practicing your vocabulary</p>
    </div>
  )

  // Session complete
  if (done) return (
    <>
      <XPToast amount={xpToast.amount} visible={xpToast.visible} />
      <AnimatePresence>{levelUp && <LevelUpModal {...levelUp} onDismiss={dismissLevelUp} />}</AnimatePresence>
      <SessionComplete score={sessionScore.good} total={sessionScore.total} xpEarned={sessionXP} onRestart={restart} onExit={() => window.location.href = '/dashboard'} />
    </>
  )

  const card = deck[idx]
  const progress = ((idx + 1) / deck.length) * 100

  return (
    <div style={{ padding: '24px 20px', maxWidth: 640, margin: '0 auto', minHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
      <XPToast amount={xpToast.amount} visible={xpToast.visible} />
      <AnimatePresence>{levelUp && <LevelUpModal {...levelUp} onDismiss={dismissLevelUp} />}</AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 24, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>Flashcards</h1>
          <span style={{ fontSize: 13, color: '#9CA3AF' }}>{idx + 1} of {deck.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {sessionXP > 0 && (
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1E3A5F', background: '#E8EEF4', padding: '4px 10px', borderRadius: 8 }}>⚡ {sessionXP} XP</span>
          )}
          <select
            value={selectedLesson}
            onChange={e => filterLesson(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 10, border: '1px solid #E5E5E0',
              fontSize: 13, fontWeight: 600, color: '#1A1A2E', background: 'white',
              cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="all">All ({allCards.length})</option>
            {lessons.map(l => (
              <option key={l.lesson_number} value={l.lesson_number}>
                {l.topic_title || `Lesson ${l.lesson_number}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 2, background: '#E5E5E0', marginBottom: 28, overflow: 'hidden' }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #1E3A5F, #2D5F8A)' }} />
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          onClick={flip}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', maxWidth: 480, minHeight: 320,
            cursor: 'pointer', perspective: 1000, marginBottom: 20,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={flipped ? 'back' : 'front'}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                background: 'white', borderRadius: 20, padding: '48px 32px',
                border: '1px solid #E5E5E0',
                boxShadow: '0 2px 8px rgba(26,26,46,0.06), 0 12px 40px rgba(26,26,46,0.04)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 320, textAlign: 'center',
              }}
            >
              {!flipped ? (
                <>
                  <div style={{
                    fontFamily: '"Frank Ruhl Libre", serif', fontSize: 52, fontWeight: 700,
                    color: '#1A1A2E', direction: 'rtl', marginBottom: 12, lineHeight: 1.2,
                  }}>{card.front}</div>
                  {card.transliteration && (
                    <div style={{ fontSize: 18, color: '#6B7280', fontStyle: 'italic', marginBottom: 16 }}>{card.transliteration}</div>
                  )}
                  {card.category && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#F5F5F3', padding: '3px 10px', borderRadius: 20 }}>{card.category}</span>
                  )}
                  <div style={{ fontSize: 12, color: '#D1D5DB', marginTop: 24 }}>tap to reveal</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>{card.back}</div>
                  <div style={{
                    fontFamily: '"Frank Ruhl Libre", serif', fontSize: 36, color: '#1E3A5F',
                    direction: 'rtl', marginBottom: 8,
                  }}>{card.front}</div>
                  {card.transliteration && (
                    <div style={{ fontSize: 16, color: '#6B7280', fontStyle: 'italic' }}>{card.transliteration}</div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Audio */}
        <button
          onClick={e => { e.stopPropagation(); playAudio(card.front) }}
          style={{
            background: 'none', border: '1px solid #E5E5E0', borderRadius: 12,
            padding: '10px 20px', fontSize: 14, fontWeight: 600, color: '#6B7280',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E3A5F'; e.currentTarget.style.color = '#1E3A5F' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E5E0'; e.currentTarget.style.color = '#6B7280' }}
        >
          🔊 Listen
        </button>

        {/* Rating buttons */}
        <AnimatePresence>
          {flipped && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, width: '100%', maxWidth: 480 }}
            >
              {[
                { key: 'again' as const, label: 'Again', xp: XP_REWARDS.FLASHCARD_AGAIN, bg: '#FEE2E2', border: '#FECACA', color: '#991B1B' },
                { key: 'hard' as const, label: 'Hard', xp: XP_REWARDS.FLASHCARD_HARD, bg: '#FFF7ED', border: '#FED7AA', color: '#9A3412' },
                { key: 'good' as const, label: 'Good', xp: XP_REWARDS.FLASHCARD_GOOD, bg: '#E8EEF4', border: '#B7D5E8', color: '#1E3A5F' },
                { key: 'easy' as const, label: 'Easy', xp: XP_REWARDS.FLASHCARD_EASY, bg: '#D1FAE5', border: '#A7F3D0', color: '#065F46' },
              ].map(btn => (
                <button
                  key={btn.key}
                  onClick={() => rate(btn.key)}
                  style={{
                    background: btn.bg, border: `2px solid ${btn.border}`, borderRadius: 14,
                    padding: '16px 8px', cursor: 'pointer', textAlign: 'center',
                    transition: 'transform 0.1s',
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
                  onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: btn.color }}>{btn.label}</div>
                  <div style={{ fontSize: 11, color: btn.color, opacity: 0.7, marginTop: 2 }}>+{btn.xp} XP</div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
