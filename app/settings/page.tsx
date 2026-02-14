'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Save, Check } from 'lucide-react'

const LANGUAGES = [
  { id: 'modern_hebrew', name: 'Modern Hebrew', nameLocal: 'עברית מודרנית' },
  { id: 'biblical_hebrew', name: 'Biblical Hebrew', nameLocal: 'עברית מקראית' },
  { id: 'yiddish', name: 'Yiddish', nameLocal: 'ייִדיש' },
  { id: 'aramaic', name: 'Aramaic', nameLocal: 'ארמית' },
]

const UI_LANGUAGES = [
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'Français' },
  { id: 'he', name: 'עברית' },
]

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedLangs, setSelectedLangs] = useState<string[]>([])
  const [level, setLevel] = useState('beginner')
  const [goals, setGoals] = useState<string[]>([])
  const [uiLanguage, setUiLanguage] = useState('en')

  const [supabase] = useState(() =>
    createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  )

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setEmail(user.email || '')
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, languages, level, goals, ui_language')
      .eq('id', user.id)
      .single()
    if (profile) {
      setDisplayName(profile.display_name || '')
      setSelectedLangs(profile.languages || [])
      setLevel(profile.level || 'beginner')
      setGoals(profile.goals || [])
      setUiLanguage(profile.ui_language || 'en')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({
      display_name: displayName,
      languages: selectedLangs,
      level,
      goals,
      ui_language: uiLanguage,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleLang = (id: string) => {
    setSelectedLangs(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id])
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-[#6b7280]">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#001B4D]">Settings</h1>
        <p className="text-[#6b7280] mt-1">Manage your profile and learning preferences.</p>
      </div>

      {/* Profile */}
      <section className="bg-white border border-[#e5e2db] p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#001B4D]">Profile</h2>
        <div>
          <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 border border-[#e5e2db] text-sm focus:border-[#001B4D] focus:outline-none bg-[#FAFAF8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-3 border border-[#e5e2db] text-sm bg-gray-50 text-[#6b7280]"
          />
        </div>
      </section>

      {/* Languages */}
      <section className="bg-white border border-[#e5e2db] p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#001B4D]">Languages I'm Learning</h2>
        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => toggleLang(lang.id)}
              className={`p-4 border-2 text-left transition ${
                selectedLangs.includes(lang.id)
                  ? 'border-[#001B4D] bg-[#001B4D]/5'
                  : 'border-[#e5e2db] hover:border-[#CFBA8C]'
              }`}
            >
              <p className="font-semibold text-sm text-[#001B4D]">{lang.name}</p>
              <p className="text-xs text-[#CFBA8C] font-hebrew" dir="rtl">{lang.nameLocal}</p>
            </button>
          ))}
        </div>
      </section>

      {/* UI Language */}
      <section className="bg-white border border-[#e5e2db] p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#001B4D]">Interface Language</h2>
        <div className="flex gap-3">
          {UI_LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => setUiLanguage(lang.id)}
              className={`px-5 py-2.5 border-2 text-sm font-semibold transition ${
                uiLanguage === lang.id
                  ? 'border-[#001B4D] bg-[#001B4D] text-white'
                  : 'border-[#e5e2db] text-[#001B4D] hover:border-[#CFBA8C]'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-[#001B4D] text-white font-semibold hover:bg-[#002b7a] disabled:opacity-50 transition inline-flex items-center gap-2"
        >
          {saving ? 'Saving...' : saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
        {saved && <span className="text-sm text-emerald-600">Your settings have been updated.</span>}
      </div>
    </div>
  )
}
