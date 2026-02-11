'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameification, XP_REWARDS, playSound, fireConfetti } from '@/hooks/useGameification'
import { XPToast, LevelUpModal } from '@/components/GameUI'

export default function ConversationsPage() {
  const { awardXP, xpToast, levelUp, dismissLevelUp } = useGameification()
  const [scenarios, setScenarios] = useState<any[]>([])
  const [current, setCurrent] = useState<any>(null)
  const [dialogIdx, setDialogIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionXP, setSessionXP] = useState(0)

  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))

  useEffect(() => { load() }, [])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('conversation_scenarios').select('*').eq('student_id', user.id)
    if (data && data.length > 0) {
      setScenarios(data)
    }
    setLoading(false)
  }

  const start = (scenario: any) => {
    setCurrent(scenario)
    setDialogIdx(0)
    setFeedback(null)
    setSessionXP(0)
  }

  const handleOption = async (option: any) => {
    const isCorrect = option.correct !== false
    setFeedback({ text: option.feedback || (isCorrect ? '!מעולה' : 'Try again'), correct: isCorrect })
    if (isCorrect) playSound('correct')
    await awardXP(XP_REWARDS.CONVERSATION_STEP)
    setSessionXP(p => p + XP_REWARDS.CONVERSATION_STEP)
    setTimeout(() => {
      setDialogIdx(p => p + 1)
      setFeedback(null)
    }, 1800)
  }

  const handleText = async () => {
    if (!userAnswer.trim()) return
    setFeedback({ text: '!יפה מאוד — Great effort', correct: true })
    playSound('correct')
    await awardXP(XP_REWARDS.CONVERSATION_STEP)
    setSessionXP(p => p + XP_REWARDS.CONVERSATION_STEP)
    setTimeout(() => {
      setDialogIdx(p => p + 1)
      setFeedback(null)
      setUserAnswer('')
    }, 1800)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #E5E5E0', borderTopColor: '#1E3A5F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  // No scenarios — show empty state
  if (scenarios.length === 0 && !current) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center', padding: 32 }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
      <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>No conversations yet</h1>
      <p style={{ color: '#6B7280', fontSize: 15, maxWidth: 360 }}>Your teacher will create personalized conversation scenarios after your lessons. Check back soon!</p>
    </div>
  )

  // Scenario selector
  if (!current) return (
    <div style={{ padding: '24px 20px', maxWidth: 640, margin: '0 auto' }}>
      <XPToast amount={xpToast.amount} visible={xpToast.visible} />
      <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Conversations</h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>Practice real-world scenarios designed by your teacher</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {scenarios.map((s, i) => (
          <motion.button
            key={s.id || i}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => start(s)}
            style={{
              background: 'white', borderRadius: 16, padding: '20px 24px',
              border: '1px solid #E5E5E0', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 1px 3px rgba(26,26,46,0.04)',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E3A5F'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,26,46,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E5E0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(26,26,46,0.04)' }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{s.context}</div>
            <div style={{ fontSize: 12, color: '#CFBA8C', fontWeight: 600, marginTop: 8 }}>{s.dialogue?.length || 0} exchanges · ~{Math.ceil((s.dialogue?.length || 0) * 0.8)} min</div>
          </motion.button>
        ))}
      </div>
    </div>
  )

  // Active conversation
  const dialogue = current.dialogue || []
  const turn = dialogue[dialogIdx]

  // Conversation complete
  if (!turn) return (
    <div style={{ padding: '24px 20px', maxWidth: 640, margin: '0 auto' }}>
      <XPToast amount={xpToast.amount} visible={xpToast.visible} />
      <AnimatePresence>{levelUp && <LevelUpModal {...levelUp} onDismiss={dismissLevelUp} />}</AnimatePresence>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 30, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Conversation complete!</h1>
        {sessionXP > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FFF7ED)', border: '2px solid #FDE68A',
            borderRadius: 14, padding: '12px 24px', marginBottom: 24,
          }}>
            <span style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 800, color: '#1A1A2E' }}>⚡ +{sessionXP} XP earned</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setDialogIdx(0); setFeedback(null); setSessionXP(0) }} className="hm-btn-primary" style={{ padding: '13px 24px' }}>Practice again</button>
          <button onClick={() => setCurrent(null)} className="hm-btn-outline" style={{ padding: '13px 24px' }}>All scenarios</button>
        </div>
      </div>
    </div>
  )

  const progress = ((dialogIdx + 1) / dialogue.length) * 100

  return (
    <div style={{ padding: '24px 20px', maxWidth: 640, margin: '0 auto' }}>
      <XPToast amount={xpToast.amount} visible={xpToast.visible} />
      <AnimatePresence>{levelUp && <LevelUpModal {...levelUp} onDismiss={dismissLevelUp} />}</AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <button onClick={() => setCurrent(null)} style={{
            background: 'none', border: 'none', fontSize: 13, color: '#9CA3AF',
            cursor: 'pointer', padding: 0, marginBottom: 4, display: 'block',
          }}>← Back</button>
          <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>{current.title}</h1>
        </div>
        {sessionXP > 0 && (
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1E3A5F', background: '#E8EEF4', padding: '4px 10px', borderRadius: 8 }}>⚡ {sessionXP}</span>
        )}
      </div>

      {/* Progress */}
      <div style={{ height: 4, borderRadius: 2, background: '#E5E5E0', marginBottom: 24, overflow: 'hidden' }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #1E3A5F, #2D5F8A)' }} />
      </div>

      {/* Context bar */}
      <div style={{
        background: '#F5F0E8', borderRadius: 12, padding: '12px 16px',
        marginBottom: 20, fontSize: 13, color: '#6B7280', lineHeight: 1.5,
        borderLeft: '3px solid #CFBA8C',
      }}>
        {current.context}
      </div>

      {/* Dialogue turn */}
      <AnimatePresence mode="wait">
        <motion.div
          key={dialogIdx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          style={{
            background: 'white', borderRadius: 18, padding: '28px 24px',
            border: '1px solid #E5E5E0', marginBottom: 16,
            boxShadow: '0 2px 8px rgba(26,26,46,0.05)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            👤 {turn.speaker}
          </div>
          <div style={{
            fontFamily: '"Frank Ruhl Libre", serif', fontSize: 28, fontWeight: 700,
            color: '#1A1A2E', direction: 'rtl', lineHeight: 1.4, marginBottom: 8,
          }}>{turn.text_he}</div>
          <div style={{ fontSize: 15, color: '#6B7280', marginBottom: 20 }}>{turn.text_en}</div>

          {/* Options */}
          {turn.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Choose your response:</div>
              {turn.options.map((opt: any, i: number) => (
                <button
                  key={i}
                  onClick={() => handleOption(opt)}
                  disabled={!!feedback}
                  style={{
                    background: '#FAFAF8', border: '1px solid #E5E5E0', borderRadius: 12,
                    padding: '14px 16px', cursor: feedback ? 'default' : 'pointer',
                    textAlign: 'left', transition: 'all 0.15s',
                    opacity: feedback ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!feedback) { e.currentTarget.style.borderColor = '#1E3A5F'; e.currentTarget.style.background = '#E8EEF4' } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E5E0'; e.currentTarget.style.background = '#FAFAF8' }}
                >
                  <div style={{ fontFamily: '"Frank Ruhl Libre", serif', fontSize: 17, fontWeight: 600, color: '#1A1A2E', direction: 'rtl' }}>{opt.he}</div>
                  <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{opt.en}</div>
                </button>
              ))}
            </div>
          )}

          {/* Free text */}
          {turn.type === 'free_text' && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Type in Hebrew:</div>
              <input
                type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)}
                placeholder="...כתוב כאן"
                dir="rtl"
                disabled={!!feedback}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: '1px solid #E5E5E0', fontSize: 16, outline: 'none',
                  fontFamily: '"Frank Ruhl Libre", serif', boxSizing: 'border-box',
                  marginBottom: 12,
                }}
                onFocus={e => e.target.style.borderColor = '#1E3A5F'}
                onBlur={e => e.target.style.borderColor = '#E5E5E0'}
                onKeyDown={e => e.key === 'Enter' && handleText()}
              />
              <button onClick={handleText} disabled={!userAnswer.trim() || !!feedback} className="hm-btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                Submit
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: feedback.correct ? '#D1FAE5' : '#FFF7ED',
              border: `1px solid ${feedback.correct ? '#A7F3D0' : '#FDBA74'}`,
              borderRadius: 12, padding: '12px 16px',
              fontSize: 14, fontWeight: 600,
              color: feedback.correct ? '#065F46' : '#9A3412',
            }}
          >
            {feedback.correct ? '✓' : '→'} {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
