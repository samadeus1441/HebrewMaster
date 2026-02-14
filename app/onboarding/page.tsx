'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const LANGUAGES = [
  { id: 'modern_hebrew', name: 'Modern Hebrew', nameLocal: 'עברית מודרנית', icon: '🇮🇱', desc: 'Conversational, business, and everyday Hebrew' },
  { id: 'biblical_hebrew', name: 'Biblical Hebrew', nameLocal: 'עברית מקראית', icon: '📜', desc: 'Torah, Prophets, Psalms, and prayer book' },
  { id: 'yiddish', name: 'Yiddish', nameLocal: 'ייִדיש', icon: '🕎', desc: 'Heritage, literature, and conversation' },
  { id: 'aramaic', name: 'Aramaic', nameLocal: 'ארמית', icon: '🏛️', desc: 'Talmud, Zohar, and ancient texts' },
]

const LEVELS = [
  { id: 'absolute_beginner', name: 'Absolute Beginner', desc: "I don't know the alphabet yet" },
  { id: 'beginner', name: 'Beginner', desc: 'I know the alphabet but struggle with reading' },
  { id: 'elementary', name: 'Elementary', desc: 'I can read slowly and know basic words' },
  { id: 'intermediate', name: 'Intermediate', desc: 'I can hold simple conversations' },
  { id: 'advanced', name: 'Advanced', desc: 'I need refinement, not basics' },
]

const GOALS = [
  { id: 'conversation', name: 'Hold Conversations', icon: '💬' },
  { id: 'reading', name: 'Read Texts & Books', icon: '📖' },
  { id: 'prayer', name: 'Prayer & Religious Texts', icon: '🕯️' },
  { id: 'family', name: 'Connect with Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'academic', name: 'Academic Study', icon: '🎓' },
  { id: 'travel', name: 'Travel to Israel', icon: '✈️' },
  { id: 'heritage', name: 'Heritage Recovery', icon: '🌳' },
  { id: 'business', name: 'Business & Work', icon: '💼' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedLangs, setSelectedLangs] = useState<string[]>([])
  const [level, setLevel] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      // Check if onboarding already completed
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, display_name')
        .eq('id', user.id)
        .single()
      if (profile?.onboarding_completed) {
        router.push('/dashboard')
      }
      if (profile?.display_name) setDisplayName(profile.display_name)
      else if (user.email) setDisplayName(user.email.split('@')[0])
    }
    checkUser()
  }, [])

  const toggleLang = (id: string) => {
    setSelectedLangs(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id])
  }

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id])
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase.from('profiles').update({
        display_name: displayName,
        languages: selectedLangs,
        level: level,
        goals: goals,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)

      router.push('/dashboard')
    } catch (err) {
      console.error('Onboarding error:', err)
    } finally {
      setSaving(false)
    }
  }

  const canProceed = () => {
    if (step === 0) return displayName.trim().length > 0
    if (step === 1) return selectedLangs.length > 0
    if (step === 2) return level !== ''
    if (step === 3) return goals.length > 0
    return true
  }

  const steps = [
    // Step 0: Name
    <div key="name" className="animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-3">
        What should we call you?
      </h2>
      <p className="text-[#6b7280] mb-8">This is how you'll appear on the platform.</p>
      <input
        type="text"
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
        className="w-full max-w-md px-5 py-4 border-2 border-[#e5e2db] text-lg focus:border-[#001B4D] focus:outline-none transition bg-white"
        placeholder="Your name"
        autoFocus
      />
    </div>,

    // Step 1: Languages
    <div key="langs" className="animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-3">
        Which languages interest you?
      </h2>
      <p className="text-[#6b7280] mb-8">Select all that apply. You can change this later.</p>
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            onClick={() => toggleLang(lang.id)}
            className={`text-left p-6 border-2 transition-all ${
              selectedLangs.includes(lang.id)
                ? 'border-[#001B4D] bg-[#001B4D]/5 shadow-md'
                : 'border-[#e5e2db] hover:border-[#CFBA8C]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{lang.icon}</span>
              <div>
                <p className="font-bold text-[#001B4D]">{lang.name}</p>
                <p className="text-sm font-hebrew text-[#CFBA8C]" dir="rtl">{lang.nameLocal}</p>
              </div>
            </div>
            <p className="text-xs text-[#6b7280]">{lang.desc}</p>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Level
    <div key="level" className="animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-3">
        Where are you now?
      </h2>
      <p className="text-[#6b7280] mb-8">Be honest — we'll calibrate everything to match you.</p>
      <div className="space-y-3 max-w-lg">
        {LEVELS.map(lvl => (
          <button
            key={lvl.id}
            onClick={() => setLevel(lvl.id)}
            className={`w-full text-left p-5 border-2 transition-all ${
              level === lvl.id
                ? 'border-[#001B4D] bg-[#001B4D]/5'
                : 'border-[#e5e2db] hover:border-[#CFBA8C]'
            }`}
          >
            <p className="font-bold text-[#001B4D]">{lvl.name}</p>
            <p className="text-sm text-[#6b7280]">{lvl.desc}</p>
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Goals
    <div key="goals" className="animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-serif text-[#001B4D] mb-3">
        What drives you?
      </h2>
      <p className="text-[#6b7280] mb-8">Select all that apply — your content will be personalized.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
        {GOALS.map(goal => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-4 border-2 text-center transition-all ${
              goals.includes(goal.id)
                ? 'border-[#001B4D] bg-[#001B4D]/5'
                : 'border-[#e5e2db] hover:border-[#CFBA8C]'
            }`}
          >
            <span className="text-2xl block mb-2">{goal.icon}</span>
            <span className="text-xs font-semibold text-[#001B4D]">{goal.name}</span>
          </button>
        ))}
      </div>
    </div>,
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-[#F5F0E8] flex flex-col">
      {/* Progress */}
      <div className="w-full bg-white border-b border-[#e5e2db] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <span className="text-sm text-[#6b7280]">Step {step + 1} of 4</span>
          <div className="flex-1 h-2 bg-[#e5e2db] rounded-full overflow-hidden">
            <div className="h-full bg-[#001B4D] transition-all duration-500 rounded-full"
                 style={{ width: `${((step + 1) / 4) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {steps[step]}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-[#e5e2db] px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm text-[#6b7280] hover:text-[#001B4D] disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          
          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1 px-6 py-3 bg-[#001B4D] text-white font-semibold text-sm hover:bg-[#002b7a] disabled:opacity-30 transition"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceed() || saving}
              className="flex items-center gap-1 px-8 py-3 bg-[#001B4D] text-white font-semibold text-sm hover:bg-[#002b7a] disabled:opacity-30 transition"
            >
              {saving ? 'Setting up...' : "Let's Begin"} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
