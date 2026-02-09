'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PracticePage() {
  const [words, setWords] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionComplete, setSessionComplete] = useState(false)

  useEffect(() => {
    loadSession()
  }, [])

  async function loadSession() {
    setLoading(true)
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    // Query srs_cards for THIS user's personalized vocabulary
    const { data } = await supabase
      .from('srs_cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(25)

    if (data && data.length > 0) {
      setWords(data)
    }
    setLoading(false)
  }

  const handleRating = async (rating: string) => {
    // Navigate to next card
    if (currentIndex < words.length - 1) {
      setIsFlipped(false)
      setCurrentIndex(prev => prev + 1)
    } else {
      setSessionComplete(true)
    }
  }

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'he-IL'
    window.speechSynthesis.speak(utterance)
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-white font-bold text-slate-400">Loading...</div>
  }

  if (sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-center p-6">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Session Complete!</h1>
        <p className="text-slate-500 mb-8">Great job practicing!</p>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-center p-6">
        <div className="text-8xl mb-6">📚</div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">No cards yet!</h1>
        <p className="text-slate-500 mb-8">Your teacher needs to import a lesson first.</p>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-10 py-4 bg-indigo-600 text-white rounded
