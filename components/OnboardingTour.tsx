// components/OnboardingTour.tsx
// ═══════════════════════════════════════════════════════════
// ONBOARDING TOUR — Guides new students through their dashboard
// Shows highlights jumping around the page with next/prev buttons
// Stores completion in localStorage so it only shows once
// ═══════════════════════════════════════════════════════════

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface TourStep {
  target: string    // CSS selector for the element to highlight
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="welcome"]',
    title: '!ברוכים הבאים — Welcome!',
    description: "This is your personal learning space. Everything here is built from YOUR actual lessons — personalized just for you. Let me show you around!",
    position: 'bottom',
  },
  {
    target: '[data-tour="lessons"]',
    title: '📚 Your Lessons',
    description: "After every lesson, your teacher uploads a summary with everything you covered. You can review what you learned, see what you struggled with, and track your progress over time.",
    position: 'right',
  },
  {
    target: '[data-tour="flashcards"]',
    title: '🃏 Smart Flashcards',
    description: "These aren't random vocabulary lists — they're built from YOUR lessons. The system knows which words are hard for you and shows those more often. Even 5 minutes a day makes a huge difference!",
    position: 'right',
  },
  {
    target: '[data-tour="quiz"]',
    title: '🎯 Quiz Yourself',
    description: "Test your knowledge of words from your lessons. The quiz adapts to your level — get it right and it moves on, get it wrong and it comes back later.",
    position: 'right',
  },
  {
    target: '[data-tour="conversations"]',
    title: '💬 Conversation Simulations',
    description: "Practice real-life scenarios based on what you're learning. Order coffee in Hebrew, navigate a market, have a family dinner conversation — all personalized to your vocabulary level.",
    position: 'right',
  },
  {
    target: '[data-tour="conjugation"]',
    title: '🏗️ Conjugation Drills',
    description: "Master Hebrew verb patterns (binyanim) through interactive drills. Present, past, future — each tense for each pattern. This is where most learners get stuck, and where we help most.",
    position: 'right',
  },
  {
    target: '[data-tour="roots"]',
    title: '🌳 Root Explorer',
    description: "Hebrew is built on roots — 3-letter combinations that generate entire word families. Enter any root and see all the words it creates. This is the key to unlocking Hebrew vocabulary fast.",
    position: 'right',
  },
  {
    target: '[data-tour="homework"]',
    title: '📝 Homework',
    description: "Your teacher leaves specific practice tasks after each lesson. Complete them before the next session and you'll feel the difference!",
    position: 'right',
  },
]

// Store tour completion per user
const TOUR_KEY = 'jb_tour_completed'

export default function OnboardingTour() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Check if tour was already completed
  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY)
    if (!completed) {
      // Small delay to let the page render
      const timer = setTimeout(() => setIsActive(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Position the tooltip near the target element
  const positionTooltip = useCallback(() => {
    const step = TOUR_STEPS[currentStep]
    if (!step) return

    const target = document.querySelector(step.target)
    if (!target) {
      // If target doesn't exist, try to find the closest sidebar link
      const fallback = document.querySelector(`a[href*="${step.target.replace('[data-tour="', '').replace('"]', '')}"]`)
      if (fallback) {
        const rect = fallback.getBoundingClientRect()
        setHighlightRect(rect)
        setTooltipPos({
          top: rect.top + window.scrollY + rect.height / 2 - 60,
          left: rect.right + 20,
        })
      } else {
        // Skip to next step
        if (currentStep < TOUR_STEPS.length - 1) {
          setCurrentStep(prev => prev + 1)
        }
      }
      return
    }

    const rect = target.getBoundingClientRect()
    setHighlightRect(rect)

    // Scroll element into view
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const pos = step.position || 'right'
    let top = rect.top + window.scrollY
    let left = rect.left + window.scrollX

    switch (pos) {
      case 'bottom':
        top = rect.bottom + window.scrollY + 12
        left = rect.left + window.scrollX + rect.width / 2 - 160
        break
      case 'top':
        top = rect.top + window.scrollY - 160
        left = rect.left + window.scrollX + rect.width / 2 - 160
        break
      case 'right':
        top = rect.top + window.scrollY + rect.height / 2 - 60
        left = rect.right + window.scrollX + 16
        break
      case 'left':
        top = rect.top + window.scrollY + rect.height / 2 - 60
        left = rect.left + window.scrollX - 340
        break
    }

    // Clamp within viewport
    top = Math.max(20, Math.min(top, window.innerHeight + window.scrollY - 200))
    left = Math.max(20, Math.min(left, window.innerWidth - 340))

    setTooltipPos({ top, left })
  }, [currentStep])

  useEffect(() => {
    if (isActive) {
      positionTooltip()
      window.addEventListener('resize', positionTooltip)
      return () => window.removeEventListener('resize', positionTooltip)
    }
  }, [isActive, currentStep, positionTooltip])

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const completeTour = () => {
    setIsActive(false)
    localStorage.setItem(TOUR_KEY, 'true')
  }

  const restartTour = () => {
    setCurrentStep(0)
    setIsActive(true)
    localStorage.removeItem(TOUR_KEY)
  }

  if (!isActive) return null

  const step = TOUR_STEPS[currentStep]

  return (
    <>
      {/* Dark overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 9998,
          transition: 'opacity 0.3s',
        }}
        onClick={completeTour}
      />

      {/* Highlight cutout */}
      {highlightRect && (
        <div
          style={{
            position: 'fixed',
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
            border: '3px solid #CFBA8C',
            borderRadius: '8px',
            zIndex: 9999,
            pointerEvents: 'none',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.5), 0 0 20px rgba(207,186,140,0.5)',
            transition: 'all 0.4s ease',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: 320,
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          zIndex: 10000,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          transition: 'all 0.4s ease',
          border: '1px solid #e5e2db',
        }}
      >
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentStep ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === currentStep ? '#001B4D' : i < currentStep ? '#9BAB16' : '#e5e2db',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#001B4D',
          margin: '0 0 8px',
          fontFamily: '"Fraunces", Georgia, serif',
        }}>
          {step.title}
        </h3>

        <p style={{
          fontSize: '13px',
          color: '#4a4a4a',
          lineHeight: 1.6,
          margin: '0 0 16px',
        }}>
          {step.description}
        </p>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                style={{
                  padding: '6px 14px',
                  background: '#f5f5f3',
                  border: '1px solid #e5e2db',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#4a4a4a',
                  cursor: 'pointer',
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={nextStep}
              style={{
                padding: '6px 14px',
                background: '#001B4D',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {currentStep < TOUR_STEPS.length - 1 ? 'Next →' : "Let's go! ✨"}
            </button>
          </div>

          <button
            onClick={completeTour}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '11px',
              color: '#9ca3af',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Skip tour
          </button>
        </div>

        {/* Step counter */}
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '12px 0 0', textAlign: 'center' }}>
          {currentStep + 1} of {TOUR_STEPS.length}
        </p>
      </div>
    </>
  )
}

// Export restart function for use in settings or help menu
export { TOUR_KEY }
