'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { motion } from 'framer-motion'

const supabase = createClient()

export default function ConversationsPage() {
  const [scenarios, setScenarios] = useState<any[]>([])
  const [currentScenario, setCurrentScenario] = useState<any>(null)
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScenarios()
  }, [])

  async function loadScenarios() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('conversation_scenarios')
      .select('*')
      .eq('student_id', user.id)

    if (data && data.length > 0) {
      setScenarios(data)
      setCurrentScenario(data[0])
    }
    setLoading(false)
  }

  const handleOptionSelect = (option: any) => {
    setFeedback(option.feedback)
    setTimeout(() => {
      setDialogueIndex(prev => prev + 1)
      setFeedback('')
    }, 2000)
  }

  const handleTextSubmit = () => {
    setFeedback('מעולה! תשובה נכונה')
    setTimeout(() => {
      setDialogueIndex(prev => prev + 1)
      setFeedback('')
      setUserAnswer('')
    }, 2000)
  }

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-slate-400">Loading...</div>

  if (!currentScenario) return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="text-8xl mb-6">💬</div>
      <h1 className="text-4xl font-bold mb-4 text-slate-900">No conversations yet</h1>
      <p className="text-slate-500">Your teacher will add practice conversations soon!</p>
    </div>
  )

  const dialogue = currentScenario.dialogue
  const currentTurn = dialogue[dialogueIndex]

  if (!currentTurn) return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="text-8xl mb-6">🎉</div>
      <h1 className="text-4xl font-bold mb-4 text-slate-900">Conversation Complete!</h1>
      <button 
        onClick={() => {
          setDialogueIndex(0)
          setFeedback('')
        }} 
        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
      >
        Practice Again
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto min-h-screen">
      <div className="bg-indigo-50 p-6 rounded-2xl mb-8 border border-indigo-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentScenario.title}</h2>
        <p className="text-slate-600">{currentScenario.context}</p>
      </div>

      <motion.div
        key={dialogueIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl mb-6 border border-slate-100"
      >
        <div className="mb-6">
          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">
            👤 {currentTurn.speaker}
          </p>
          <h3 className="text-4xl font-bold mb-2 text-slate-900" dir="rtl">{currentTurn.text_he}</h3>
          <p className="text-slate-500 text-lg">{currentTurn.text_en}</p>
        </div>

        {currentTurn.options && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 font-bold mb-3">Choose your response:</p>
            {currentTurn.options.map((opt: any, i: number) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(opt)}
                disabled={!!feedback}
                className="w-full p-4 bg-slate-50 hover:bg-indigo-50 rounded-xl text-left border-2 border-transparent hover:border-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="font-bold text-lg text-slate-900" dir="rtl">{opt.he}</p>
                <p className="text-slate-500 text-sm">{opt.en}</p>
              </button>
            ))}
          </div>
        )}

        {currentTurn.type === 'free_text' && (
          <div>
            <p className="text-sm text-slate-500 font-bold mb-3">Type your response in Hebrew:</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="כתוב תשובה בעברית..."
              className="w-full p-4 border-2 border-slate-200 rounded-xl mb-4 text-lg focus:border-indigo-500 focus:outline-none"
              dir="rtl"
              disabled={!!feedback}
            />
            <button
              onClick={handleTextSubmit}
              disabled={!userAnswer.trim() || !!feedback}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        )}
      </motion.div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border-2 border-green-300 p-6 rounded-2xl"
        >
          <p className="text-green-800 font-bold">✅ {feedback}</p>
        </motion.div>
      )}
    </div>
  )
}
