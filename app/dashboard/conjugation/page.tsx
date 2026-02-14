'use client'

import { useState, useEffect, useMemo } from 'react'
import { Check, X, RotateCcw, Trophy, ChevronRight } from 'lucide-react'

type Conjugation = {
  root: string
  binyan: string
  tense: string
  person: string
  answer: string
  answerPointed: string
  transliteration: string
  hint: string
}

const BINYANIM_INFO = [
  { name: "Pa'al", hebrew: 'פָּעַל', function: 'Simple Active', example: 'כָּתַב (wrote)', color: 'bg-blue-500' },
  { name: "Nif'al", hebrew: 'נִפְעַל', function: 'Simple Passive / Reflexive', example: 'נִכְתַּב (was written)', color: 'bg-purple-500' },
  { name: "Pi'el", hebrew: 'פִּעֵל', function: 'Intensive Active', example: 'דִּבֵּר (spoke)', color: 'bg-amber-500' },
  { name: "Pu'al", hebrew: 'פֻּעַל', function: 'Intensive Passive', example: 'דֻּבַּר (was spoken)', color: 'bg-orange-500' },
  { name: "Hif'il", hebrew: 'הִפְעִיל', function: 'Causative Active', example: 'הִכְתִּיב (dictated)', color: 'bg-emerald-500' },
  { name: "Huf'al", hebrew: 'הֻפְעַל', function: 'Causative Passive', example: 'הֻכְתַּב (was dictated)', color: 'bg-teal-500' },
  { name: "Hitpa'el", hebrew: 'הִתְפַּעֵל', function: 'Reflexive', example: 'הִתְכַּתֵּב (corresponded)', color: 'bg-rose-500' },
]

// Sample drill data — in production this comes from Supabase
const DRILL_DATA: Conjugation[] = [
  { root: 'כ.ת.ב', binyan: "Pa'al", tense: 'Past', person: 'he (3ms)', answer: 'כתב', answerPointed: 'כָּתַב', transliteration: 'katav', hint: 'Simple past, masculine singular' },
  { root: 'כ.ת.ב', binyan: "Pa'al", tense: 'Past', person: 'she (3fs)', answer: 'כתבה', answerPointed: 'כָּתְבָה', transliteration: 'katva', hint: 'Add ה suffix for feminine' },
  { root: 'כ.ת.ב', binyan: "Pa'al", tense: 'Present', person: 'he (ms)', answer: 'כותב', answerPointed: 'כּוֹתֵב', transliteration: 'kotev', hint: 'Present tense pattern: קוֹטֵל' },
  { root: 'כ.ת.ב', binyan: "Pa'al", tense: 'Present', person: 'she (fs)', answer: 'כותבת', answerPointed: 'כּוֹתֶבֶת', transliteration: 'kotevet', hint: 'Feminine present: add ת' },
  { root: 'כ.ת.ב', binyan: "Pa'al", tense: 'Future', person: 'I (1s)', answer: 'אכתוב', answerPointed: 'אֶכְתֹּב', transliteration: 'ekhtov', hint: 'Future prefix: א for first person' },
  { root: 'ל.מ.ד', binyan: "Pa'al", tense: 'Past', person: 'he (3ms)', answer: 'למד', answerPointed: 'לָמַד', transliteration: 'lamad', hint: 'Simple past: CaCaC' },
  { root: 'ל.מ.ד', binyan: "Pi'el", tense: 'Past', person: 'he (3ms)', answer: 'לימד', answerPointed: 'לִמֵּד', transliteration: 'limed', hint: "Pi'el pattern intensifies: taught" },
  { root: 'ש.מ.ר', binyan: "Pa'al", tense: 'Past', person: 'he (3ms)', answer: 'שמר', answerPointed: 'שָׁמַר', transliteration: 'shamar', hint: 'To guard/keep' },
  { root: 'ש.מ.ר', binyan: "Nif'al", tense: 'Past', person: 'he (3ms)', answer: 'נשמר', answerPointed: 'נִשְׁמַר', transliteration: 'nishmar', hint: "Nif'al prefix: נ (passive/reflexive)" },
  { root: 'כ.ת.ב', binyan: "Hif'il", tense: 'Past', person: 'he (3ms)', answer: 'הכתיב', answerPointed: 'הִכְתִּיב', transliteration: 'hikhtiv', hint: "Hif'il prefix: ה (causative)" },
]

export default function ConjugationPage() {
  const [mode, setMode] = useState<'learn' | 'drill'>('learn')
  const [drillItems, setDrillItems] = useState<Conjugation[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [showHint, setShowHint] = useState(false)
  const [selectedBinyan, setSelectedBinyan] = useState<string>('all')

  useEffect(() => {
    startDrill()
  }, [selectedBinyan])

  const startDrill = () => {
    const filtered = selectedBinyan === 'all'
      ? [...DRILL_DATA]
      : DRILL_DATA.filter(d => d.binyan === selectedBinyan)
    // Shuffle
    const shuffled = filtered.sort(() => Math.random() - 0.5)
    setDrillItems(shuffled)
    setCurrentIdx(0)
    setScore({ correct: 0, total: 0 })
    setUserAnswer('')
    setShowResult(false)
    setShowHint(false)
  }

  const checkAnswer = () => {
    if (!userAnswer.trim()) return
    const current = drillItems[currentIdx]
    // Compare without nikud
    const clean = (s: string) => s.normalize('NFD').replace(/[\u0591-\u05C7]/g, '').normalize('NFC').trim()
    const correct = clean(userAnswer) === clean(current.answer)
    setIsCorrect(correct)
    setShowResult(true)
    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }))
  }

  const next = () => {
    setCurrentIdx(i => i + 1)
    setUserAnswer('')
    setShowResult(false)
    setShowHint(false)
  }

  const current = drillItems[currentIdx]
  const isComplete = currentIdx >= drillItems.length

  if (mode === 'learn') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-[#001B4D]">Binyanim — Verb Patterns</h1>
          <p className="text-[#6b7280] mt-1">The 7 building blocks of Hebrew verbs. Master these and you can conjugate any verb.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {BINYANIM_INFO.map((b) => (
            <div key={b.name} className="bg-white border border-[#e5e2db] p-6 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${b.color}`} />
                <h3 className="text-lg font-bold text-[#001B4D]">{b.name}</h3>
                <span className="font-hebrew text-lg text-[#CFBA8C]" dir="rtl">{b.hebrew}</span>
              </div>
              <p className="text-sm text-[#4a4a4a] mb-2">{b.function}</p>
              <p className="text-xs font-mono text-[#6b7280]">e.g. {b.example}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-6">
          <button
            onClick={() => { setMode('drill'); startDrill() }}
            className="px-8 py-4 bg-[#001B4D] text-white font-bold text-lg hover:bg-[#002b7a] transition inline-flex items-center gap-2"
          >
            Start Conjugation Drill <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  if (isComplete) {
    const pct = Math.round((score.correct / score.total) * 100)
    return (
      <div className="max-w-lg mx-auto text-center py-12 space-y-6">
        <Trophy className="w-16 h-16 mx-auto text-[#9BAB16]" />
        <h2 className="text-3xl font-serif text-[#001B4D]">Drill Complete!</h2>
        <div className="text-5xl font-bold text-[#001B4D]">{pct}%</div>
        <p className="text-[#6b7280]">{score.correct} of {score.total} correct</p>
        <div className="flex gap-3 justify-center">
          <button onClick={startDrill} className="px-6 py-3 bg-[#001B4D] text-white font-semibold hover:bg-[#002b7a] transition inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button onClick={() => setMode('learn')} className="px-6 py-3 border-2 border-[#001B4D] text-[#001B4D] font-semibold hover:bg-[#001B4D]/5 transition">
            Back to Reference
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setMode('learn')} className="text-sm text-[#6b7280] hover:text-[#001B4D]">← Back to reference</button>
        <span className="text-sm font-semibold text-[#001B4D]">{currentIdx + 1} / {drillItems.length}</span>
      </div>

      {/* Filter */}
      <select
        value={selectedBinyan}
        onChange={e => setSelectedBinyan(e.target.value)}
        className="px-3 py-2 border border-[#e5e2db] text-sm bg-white focus:border-[#001B4D] focus:outline-none"
      >
        <option value="all">All Binyanim</option>
        {BINYANIM_INFO.map(b => (
          <option key={b.name} value={b.name}>{b.name} ({b.hebrew})</option>
        ))}
      </select>

      {/* Drill Card */}
      {current && (
        <div className="bg-white border border-[#e5e2db] p-8 text-center space-y-6">
          {/* Prompt */}
          <div>
            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1">Conjugate</p>
            <p className="font-hebrew text-3xl text-[#001B4D]" dir="rtl">{current.root}</p>
            <div className="flex justify-center gap-3 mt-3">
              <span className="px-3 py-1 bg-[#001B4D]/10 text-[#001B4D] text-sm font-semibold rounded">{current.binyan}</span>
              <span className="px-3 py-1 bg-[#CFBA8C]/20 text-[#8a6b2f] text-sm font-semibold rounded">{current.tense}</span>
              <span className="px-3 py-1 bg-[#9BAB16]/15 text-[#6b7a0e] text-sm font-semibold rounded">{current.person}</span>
            </div>
          </div>

          {/* Input */}
          <div>
            <input
              type="text"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { showResult ? next() : checkAnswer() } }}
              className="w-full max-w-xs mx-auto px-6 py-4 border-2 border-[#e5e2db] font-hebrew text-2xl text-center focus:border-[#001B4D] focus:outline-none transition bg-[#FAFAF8]"
              dir="rtl"
              placeholder="...הקלד כאן"
              disabled={showResult}
              autoFocus
            />
          </div>

          {/* Hint */}
          {!showResult && (
            <button onClick={() => setShowHint(!showHint)} className="text-xs text-[#6b7280] hover:text-[#001B4D] underline">
              {showHint ? current.hint : 'Show hint'}
            </button>
          )}

          {/* Result */}
          {showResult && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? <Check className="w-5 h-5 text-emerald-600" /> : <X className="w-5 h-5 text-red-600" />}
                <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite'}
                </span>
              </div>
              <p className="font-hebrew text-2xl text-[#001B4D]" dir="rtl">{current.answerPointed}</p>
              <p className="text-sm font-mono text-[#6b7280] mt-1">{current.transliteration}</p>
            </div>
          )}

          {/* Actions */}
          <div>
            {!showResult ? (
              <button onClick={checkAnswer} disabled={!userAnswer.trim()} className="px-8 py-3 bg-[#001B4D] text-white font-semibold hover:bg-[#002b7a] disabled:opacity-30 transition">
                Check
              </button>
            ) : (
              <button onClick={next} className="px-8 py-3 bg-[#001B4D] text-white font-semibold hover:bg-[#002b7a] transition inline-flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Score */}
          <p className="text-sm text-[#6b7280]">Score: {score.correct}/{score.total}</p>
        </div>
      )}
    </div>
  )
}
