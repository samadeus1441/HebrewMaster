'use client'
import { motion, AnimatePresence } from 'framer-motion'

// XP Toast — floats in from top-right, fades out
export function XPToast({ amount, visible }: { amount: number; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F8A 100%)',
            color: 'white', padding: '10px 18px', borderRadius: 12,
            fontWeight: 800, fontSize: 15, fontFamily: '"Plus Jakarta Sans", sans-serif',
            boxShadow: '0 4px 20px rgba(30,58,95,0.35)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ fontSize: 18 }}>⚡</span>+{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Level Up Modal — full screen overlay with confetti moment
export function LevelUpModal({
  level, name, english, onDismiss,
}: {
  level: number; name: string; english: string; onDismiss: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 28, padding: '52px 44px',
          textAlign: 'center', maxWidth: 380, width: '90%',
          boxShadow: '0 32px 100px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
        <h2 style={{
          fontFamily: '"Fraunces", serif', fontSize: 30, fontWeight: 700,
          color: '#1A1A2E', marginBottom: 6, letterSpacing: '-0.02em',
        }}>Level Up!</h2>
        <div style={{
          fontFamily: '"Frank Ruhl Libre", serif', fontSize: 56,
          color: '#1E3A5F', marginBottom: 4, direction: 'rtl' as const, lineHeight: 1.1,
        }}>{name}</div>
        <div style={{
          fontSize: 14, fontWeight: 600, color: '#9CA3AF',
          textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 20,
        }}>Level {level} · {english}</div>
        <button
          onClick={onDismiss}
          className="hm-btn-primary"
          style={{ width: '100%', padding: '14px 24px', fontSize: 16 }}
        >
          !יאללה
        </button>
      </motion.div>
    </motion.div>
  )
}

// Session Complete overlay
export function SessionComplete({
  score, total, xpEarned, onRestart, onExit,
}: {
  score: number; total: number; xpEarned: number;
  onRestart: () => void; onExit: () => void
}) {
  const pct = Math.round((score / total) * 100)
  const emoji = pct === 100 ? '🏆' : pct >= 80 ? '⭐' : pct >= 50 ? '👍' : '💪'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
        justifyContent: 'center', minHeight: '70vh', padding: 32, textAlign: 'center' as const,
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 16 }}>{emoji}</div>
      <h1 style={{
        fontFamily: '"Fraunces", serif', fontSize: 36, fontWeight: 700,
        color: '#1A1A2E', marginBottom: 8,
      }}>Session Complete!</h1>
      <div style={{
        fontFamily: '"Fraunces", serif', fontSize: 56, fontWeight: 800,
        color: '#1E3A5F', lineHeight: 1,
      }}>{score}/{total}</div>
      <div style={{ fontSize: 16, color: '#6B7280', marginBottom: 20 }}>{pct}% correct</div>

      <div style={{
        background: 'linear-gradient(135deg, #FEF3C7, #FFF7ED)',
        border: '2px solid #FDE68A', borderRadius: 16, padding: '16px 28px',
        marginBottom: 28,
      }}>
        <span style={{
          fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 800, color: '#1A1A2E',
        }}>⚡ +{xpEarned} XP earned</span>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onRestart} className="hm-btn-primary" style={{ padding: '14px 28px' }}>
          Go Again
        </button>
        <button onClick={onExit} className="hm-btn-outline" style={{ padding: '14px 28px' }}>
          Done
        </button>
      </div>
    </motion.div>
  )
}
