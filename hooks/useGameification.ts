'use client'
import { useState, useCallback, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// ═══════════════════════════════════════════════════════════════
// HEBREW MASTER — GAMIFICATION ENGINE
// Every interaction should feel like unwrapping a gift.
// ═══════════════════════════════════════════════════════════════

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const HEBREW_LEVELS = [
  { level: 1, name: 'אָלֶף', xp: 0, english: 'Alef' },
  { level: 2, name: 'בֵּית', xp: 30, english: 'Bet' },
  { level: 3, name: 'גִּימֶל', xp: 70, english: 'Gimel' },
  { level: 4, name: 'דָּלֶת', xp: 130, english: 'Dalet' },
  { level: 5, name: 'הֵא', xp: 200, english: 'He' },
  { level: 6, name: 'וָו', xp: 280, english: 'Vav' },
  { level: 7, name: 'זַיִן', xp: 380, english: 'Zayin' },
  { level: 8, name: 'חֵית', xp: 500, english: 'Chet' },
  { level: 9, name: 'טֵית', xp: 650, english: 'Tet' },
  { level: 10, name: 'יוֹד', xp: 800, english: 'Yod' },
  { level: 11, name: 'כָּף', xp: 1000, english: 'Kaf' },
  { level: 12, name: 'לָמֶד', xp: 1200, english: 'Lamed' },
  { level: 13, name: 'מֵם', xp: 1400, english: 'Mem' },
  { level: 14, name: 'נוּן', xp: 1600, english: 'Nun' },
  { level: 15, name: 'סָמֶךְ', xp: 1900, english: 'Samekh' },
  { level: 16, name: 'עַיִן', xp: 2200, english: 'Ayin' },
  { level: 17, name: 'פֵּא', xp: 2600, english: 'Pe' },
  { level: 18, name: 'צָדִי', xp: 3000, english: 'Tsadi' },
  { level: 19, name: 'קוֹף', xp: 3500, english: 'Qof' },
  { level: 20, name: 'רֵישׁ', xp: 4000, english: 'Resh' },
  { level: 21, name: 'שִׁין', xp: 4500, english: 'Shin' },
  { level: 22, name: 'תָּו', xp: 5000, english: 'Tav' },
]

export const XP_REWARDS = {
  FLASHCARD_AGAIN: 1,
  FLASHCARD_HARD: 3,
  FLASHCARD_GOOD: 5,
  FLASHCARD_EASY: 10,
  QUIZ_CORRECT: 8,
  QUIZ_WRONG: 2,
  CONVERSATION_STEP: 5,
  SESSION_COMPLETE: 25,
}

export function getLevelFromXP(xp: number) {
  let current = HEBREW_LEVELS[0]
  for (const l of HEBREW_LEVELS) {
    if (xp >= l.xp) current = l
    else break
  }
  const next = HEBREW_LEVELS.find(l => l.level === current.level + 1)
  const xpInLevel = xp - current.xp
  const xpNeeded = next ? next.xp - current.xp : 0
  const progress = next ? Math.min(xpInLevel / xpNeeded, 1) : 1
  return {
    level: current.level,
    name: current.name,
    english: current.english,
    xp,
    xpInLevel,
    xpNeeded,
    progress,
    nextLevel: next?.name || null,
    isMax: !next,
  }
}

// Minimal, pleasant sound effects
export function playSound(type: 'correct' | 'wrong' | 'flip' | 'xp' | 'levelup') {
  if (typeof window === 'undefined') return
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const make = (freq: number, dur: number, vol: number, wave: OscillatorType = 'sine', delay = 0) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.frequency.value = freq; o.type = wave
      g.gain.setValueAtTime(vol, ctx.currentTime + delay)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur)
      o.start(ctx.currentTime + delay)
      o.stop(ctx.currentTime + delay + dur)
    }
    switch (type) {
      case 'correct': make(523, 0.12, 0.12); make(659, 0.18, 0.12, 'sine', 0.08); break
      case 'wrong': make(220, 0.25, 0.08, 'triangle'); break
      case 'flip': make(880, 0.06, 0.04); break
      case 'xp': make(1047, 0.1, 0.06); break
      case 'levelup':
        [523, 659, 784, 1047].forEach((f, i) => make(f, 0.25, 0.1, 'sine', i * 0.1))
        break
    }
  } catch (_) {}
}

export function fireConfetti(intensity: 'light' | 'medium' | 'heavy' = 'medium') {
  if (typeof window === 'undefined') return
  import('canvas-confetti').then(({ default: confetti }) => {
    const colors = ['#1E3A5F', '#F59E0B', '#10B981', '#CFBA8C', '#FFFFFF']
    const counts = { light: 30, medium: 80, heavy: 160 }
    const spreads = { light: 50, medium: 70, heavy: 110 }
    confetti({ particleCount: counts[intensity], spread: spreads[intensity], origin: { y: 0.6 }, colors, gravity: 0.8 })
    if (intensity === 'heavy') {
      setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.7 }, colors }), 250)
    }
  })
}

export function useGameification() {
  const [xpToast, setXpToast] = useState<{ amount: number; visible: boolean }>({ amount: 0, visible: false })
  const [levelUp, setLevelUp] = useState<{ level: number; name: string; english: string } | null>(null)
  const timer = useRef<NodeJS.Timeout | null>(null)

  const awardXP = useCallback(async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, level, streak, last_activity_date')
      .eq('id', user.id)
      .single()

    const oldXp = profile?.xp || 0
    const oldLevel = profile?.level || 1
    const newXp = oldXp + amount
    const info = getLevelFromXP(newXp)
    const leveled = info.level > oldLevel

    // Streak
    const today = new Date().toISOString().split('T')[0]
    const last = profile?.last_activity_date
    let streak = profile?.streak || 0
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      streak = last === yesterday ? streak + 1 : 1
    }

    await supabase.from('profiles').update({
      xp: newXp, level: info.level, level_name: info.name,
      streak, last_activity_date: today, updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    // Toast
    playSound('xp')
    if (timer.current) clearTimeout(timer.current)
    setXpToast({ amount, visible: true })
    timer.current = setTimeout(() => setXpToast(p => ({ ...p, visible: false })), 2200)

    // Level up
    if (leveled) {
      setTimeout(() => {
        playSound('levelup')
        fireConfetti('heavy')
        setLevelUp({ level: info.level, name: info.name, english: info.english })
      }, 400)
    }

    return { xp: newXp, leveled }
  }, [])

  const dismissLevelUp = useCallback(() => setLevelUp(null), [])

  return { awardXP, xpToast, levelUp, dismissLevelUp }
}
