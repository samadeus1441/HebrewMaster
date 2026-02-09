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
    return (
      <div className="flex h-screen items-center justify-center bg-white font-bold text-slate-400">
        Loading...
      </div>
    )
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
          className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6" dir="ltr">
      {/* Progress bar */}
      <div className="w-full max-w-md mb-8 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="w-full max-w-md aspect-[4/5] relative perspective-1000">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 bg-white border border-slate-100 shadow-xl rounded-[40px] p-8 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => setIsFlipped(true)}
            >
              <p className="text-sm text-slate-400 mb-4">{currentIndex + 1} / {words.length}</p>
              <h2 className="text-6xl font-black text-slate-900 mb-4" dir="rtl">{currentWord.front}</h2>
              <p className="text-indigo-600 italic">{currentWord.transliteration}</p>
              <p className="text-slate-400 mt-8 text-sm">Tap to reveal</p>
              <button
                onClick={(e) => { e.stopPropagation(); playAudio(currentWord.front) }}
                className="mt-4 text-2xl"
              >
                🔊
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 bg-white border border-slate-100 shadow-xl rounded-[40px] p-8 flex flex-col"
            >
              <div className="flex-1 flex flex-col items-center justify-center">
                <h3 className="text-4xl font-bold text-slate-900 mb-2">{currentWord.back}</h3>
                <p className="text-slate-500 mb-4">{currentWord.category}</p>
                <p className="text-2xl text-slate-700" dir="rtl">{currentWord.front}</p>
              </div>
              
              {/* Rating buttons */}
              <div className="grid grid-cols-4 gap-2">
                {['Again', 'Hard', 'Good', 'Easy'].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${
                      rating === 'Again' ? 'bg-red-100 text-red-600 hover:bg-red-200' :
                      rating === 'Hard' ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' :
                      rating === 'Good' ? 'bg-green-100 text-green-600 hover:bg-green-200' :
                      'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
