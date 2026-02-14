'use client'

import { useState, useCallback } from 'react'
import { Eye, EyeOff, Volume2, BookOpen, ChevronDown, RotateCcw, Sparkles } from 'lucide-react'

// Nikud (vowel) Unicode ranges
const NIKUD_RANGE = /[\u0591-\u05C7]/g
const CANTILLATION = /[\u0591-\u05AF]/g

type NikudLevel = 'full' | 'partial' | 'consonants_only'
type WordData = { pointed: string; unpointed: string; transliteration?: string; meaning?: string }

// Sample texts for demo — in production these come from Supabase
const SAMPLE_TEXTS = [
  {
    id: 'bereishit',
    title: 'בראשית א:א',
    titleEn: 'Genesis 1:1',
    category: 'Torah',
    text: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃',
    words: [
      { pointed: 'בְּרֵאשִׁית', unpointed: 'בראשית', transliteration: 'bereishit', meaning: 'In the beginning' },
      { pointed: 'בָּרָא', unpointed: 'ברא', transliteration: 'bara', meaning: 'created' },
      { pointed: 'אֱלֹהִים', unpointed: 'אלהים', transliteration: 'elohim', meaning: 'God' },
      { pointed: 'אֵת', unpointed: 'את', transliteration: 'et', meaning: '(object marker)' },
      { pointed: 'הַשָּׁמַיִם', unpointed: 'השמים', transliteration: 'hashamayim', meaning: 'the heavens' },
      { pointed: 'וְאֵת', unpointed: 'ואת', transliteration: "ve'et", meaning: 'and (obj. marker)' },
      { pointed: 'הָאָרֶץ׃', unpointed: 'הארץ', transliteration: 'ha-aretz', meaning: 'the earth' },
    ],
  },
  {
    id: 'shema',
    title: 'שְׁמַע יִשְׂרָאֵל',
    titleEn: 'Shema Yisrael',
    category: 'Prayer',
    text: 'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד׃',
    words: [
      { pointed: 'שְׁמַע', unpointed: 'שמע', transliteration: 'shema', meaning: 'Hear!' },
      { pointed: 'יִשְׂרָאֵל', unpointed: 'ישראל', transliteration: 'yisrael', meaning: 'Israel' },
      { pointed: 'יְהוָה', unpointed: 'יהוה', transliteration: 'Adonai', meaning: 'the LORD' },
      { pointed: 'אֱלֹהֵינוּ', unpointed: 'אלהינו', transliteration: 'eloheinu', meaning: 'our God' },
      { pointed: 'יְהוָה', unpointed: 'יהוה', transliteration: 'Adonai', meaning: 'the LORD' },
      { pointed: 'אֶחָד׃', unpointed: 'אחד', transliteration: 'echad', meaning: 'is one' },
    ],
  },
  {
    id: 'modern_convo',
    title: 'שיחה מודרנית',
    titleEn: 'Modern Conversation',
    category: 'Modern',
    text: 'שָׁלוֹם! מַה שְׁלוֹמְךָ? אֲנִי גָּר בִּירוּשָׁלַיִם וְאֲנִי אוֹהֵב אֶת הָעִיר הַזֹּאת מְאוֹד׃',
    words: [
      { pointed: 'שָׁלוֹם!', unpointed: 'שלום!', transliteration: 'shalom', meaning: 'Hello/Peace!' },
      { pointed: 'מַה', unpointed: 'מה', transliteration: 'ma', meaning: 'What/How' },
      { pointed: 'שְׁלוֹמְךָ?', unpointed: 'שלומך?', transliteration: 'shlomkha', meaning: 'is your wellbeing?' },
      { pointed: 'אֲנִי', unpointed: 'אני', transliteration: 'ani', meaning: 'I' },
      { pointed: 'גָּר', unpointed: 'גר', transliteration: 'gar', meaning: 'live' },
      { pointed: 'בִּירוּשָׁלַיִם', unpointed: 'בירושלים', transliteration: 'birushalayim', meaning: 'in Jerusalem' },
      { pointed: 'וְאֲנִי', unpointed: 'ואני', transliteration: "va'ani", meaning: 'and I' },
      { pointed: 'אוֹהֵב', unpointed: 'אוהב', transliteration: 'ohev', meaning: 'love' },
      { pointed: 'אֶת', unpointed: 'את', transliteration: 'et', meaning: '(obj.)' },
      { pointed: 'הָעִיר', unpointed: 'העיר', transliteration: 'ha-ir', meaning: 'the city' },
      { pointed: 'הַזֹּאת', unpointed: 'הזאת', transliteration: 'hazot', meaning: 'this' },
      { pointed: 'מְאוֹד׃', unpointed: 'מאוד', transliteration: "me'od", meaning: 'very much' },
    ],
  },
]

function removeNikud(text: string): string {
  return text.normalize('NFD').replace(NIKUD_RANGE, '').normalize('NFC')
}

function removeOnlyCantillation(text: string): string {
  return text.normalize('NFD').replace(CANTILLATION, '').normalize('NFC')
}

function InteractiveWord({ word, nikudLevel, showTransliteration, showMeaning }: {
  word: WordData; nikudLevel: NikudLevel; showTransliteration: boolean; showMeaning: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const displayText = nikudLevel === 'full'
    ? word.pointed
    : nikudLevel === 'partial' && (hovered || revealed)
      ? word.pointed
      : word.unpointed

  return (
    <span
      className="relative inline-block cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setRevealed(!revealed)}
    >
      <span className={`
        inline-block px-1.5 py-0.5 rounded-md transition-all duration-300
        font-hebrew text-3xl md:text-4xl leading-relaxed
        ${nikudLevel === 'partial' && !hovered && !revealed ? 'bg-[#001B4D]/5 hover:bg-[#CFBA8C]/20' : ''}
        ${nikudLevel === 'consonants_only' && (hovered || revealed) ? 'bg-[#CFBA8C]/20' : ''}
        ${revealed ? 'ring-2 ring-[#CFBA8C]/40' : ''}
      `}>
        {displayText}
      </span>

      {/* Tooltip */}
      {(hovered) && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#001B4D] text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none animate-fade-in">
          {showTransliteration && word.transliteration && (
            <span className="block font-mono">{word.transliteration}</span>
          )}
          {showMeaning && word.meaning && (
            <span className="block text-white/70">{word.meaning}</span>
          )}
          {nikudLevel !== 'full' && (
            <span className="block text-[#CFBA8C] font-hebrew text-sm mt-1" dir="rtl">{word.pointed}</span>
          )}
        </span>
      )}
    </span>
  )
}

export default function ReadingPage() {
  const [selectedText, setSelectedText] = useState(SAMPLE_TEXTS[0])
  const [nikudLevel, setNikudLevel] = useState<NikudLevel>('full')
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [showMeaning, setShowMeaning] = useState(true)
  const [customText, setCustomText] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [showTextPicker, setShowTextPicker] = useState(false)

  const stripCustomNikud = useCallback((text: string) => {
    return removeNikud(text)
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-[#001B4D]">Reading Interface</h1>
        <p className="text-[#6b7280] mt-1">
          The vowel bridge — transition from pointed to unpointed text at your own pace.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white border border-[#e5e2db] p-4 flex flex-wrap items-center gap-4">
        {/* Nikud Level Control */}
        <div className="flex-1 min-w-[280px]">
          <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2 block">
            Vowel Level
          </label>
          <div className="flex bg-[#FAFAF8] border border-[#e5e2db] rounded-lg overflow-hidden">
            {([
              { id: 'full' as const, label: 'Full Nikud', icon: Eye },
              { id: 'partial' as const, label: 'Hover to Reveal', icon: Sparkles },
              { id: 'consonants_only' as const, label: 'Consonants Only', icon: EyeOff },
            ]).map(opt => (
              <button
                key={opt.id}
                onClick={() => setNikudLevel(opt.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition ${
                  nikudLevel === opt.id
                    ? 'bg-[#001B4D] text-white'
                    : 'text-[#6b7280] hover:text-[#001B4D]'
                }`}
              >
                <opt.icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Options */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showTransliteration}
              onChange={e => setShowTransliteration(e.target.checked)}
              className="w-4 h-4 accent-[#001B4D]"
            />
            <span className="text-xs font-semibold text-[#4a4a4a]">Transliteration</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMeaning}
              onChange={e => setShowMeaning(e.target.checked)}
              className="w-4 h-4 accent-[#001B4D]"
            />
            <span className="text-xs font-semibold text-[#4a4a4a]">Meaning</span>
          </label>
        </div>
      </div>

      {/* Text Selector */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <button
            onClick={() => setShowTextPicker(!showTextPicker)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#e5e2db] text-sm font-semibold text-[#001B4D] hover:border-[#CFBA8C] transition"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {isCustomMode ? 'Custom Text' : `${selectedText.titleEn} — ${selectedText.category}`}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showTextPicker && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e2db] shadow-xl z-10">
              {SAMPLE_TEXTS.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedText(t); setIsCustomMode(false); setShowTextPicker(false) }}
                  className="w-full text-left px-4 py-3 hover:bg-[#FAFAF8] transition border-b border-[#e5e2db] last:border-0"
                >
                  <span className="text-sm font-semibold text-[#001B4D]">{t.titleEn}</span>
                  <span className="text-xs text-[#6b7280] ml-2">{t.category}</span>
                  <span className="text-sm font-hebrew text-[#CFBA8C] block" dir="rtl">{t.title}</span>
                </button>
              ))}
              <button
                onClick={() => { setIsCustomMode(true); setShowTextPicker(false) }}
                className="w-full text-left px-4 py-3 hover:bg-[#FAFAF8] transition text-sm font-semibold text-[#001B4D]"
              >
                ✏️ Paste Your Own Text
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Text Input */}
      {isCustomMode && (
        <div className="bg-white border border-[#e5e2db] p-4">
          <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2 block">
            Paste Hebrew Text (with or without nikud)
          </label>
          <textarea
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="הדבק כאן טקסט בעברית..."
            className="w-full h-32 px-4 py-3 border border-[#e5e2db] font-hebrew text-xl text-right bg-[#FAFAF8] focus:border-[#001B4D] focus:outline-none resize-none"
            dir="rtl"
          />
          <p className="text-xs text-[#6b7280] mt-2">
            Tip: Paste pointed text for the full experience. The toggle will strip vowels automatically.
          </p>
        </div>
      )}

      {/* Reading Area */}
      <div className="bg-[#FBF3D4] border border-[#CFBA8C]/30 p-8 md:p-12 min-h-[300px]"
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`, backgroundSize: '200px' }}>
        
        {/* Structured Reading */}
        {!isCustomMode && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-sm font-semibold text-[#001B4D]/60 uppercase tracking-wider">{selectedText.category}</h3>
              <p className="font-serif text-lg text-[#001B4D]">{selectedText.titleEn}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-3 gap-y-4" dir="rtl">
              {selectedText.words.map((word, i) => (
                <InteractiveWord
                  key={i}
                  word={word}
                  nikudLevel={nikudLevel}
                  showTransliteration={showTransliteration}
                  showMeaning={showMeaning}
                />
              ))}
            </div>

            {/* Guide text */}
            <div className="mt-8 text-center">
              {nikudLevel === 'full' && (
                <p className="text-sm text-[#001B4D]/50">Full vowel marks shown. Hover any word for details.</p>
              )}
              {nikudLevel === 'partial' && (
                <p className="text-sm text-[#001B4D]/50">Vowels hidden — hover or tap a word to reveal its nikud.</p>
              )}
              {nikudLevel === 'consonants_only' && (
                <p className="text-sm text-[#001B4D]/50">Consonants only — can you read it? Hover to check.</p>
              )}
            </div>
          </div>
        )}

        {/* Custom Text Display */}
        {isCustomMode && customText && (
          <div className="text-center">
            <p className="font-hebrew text-3xl md:text-4xl leading-loose text-[#1a1a1a]" dir="rtl">
              {nikudLevel === 'full' ? customText : stripCustomNikud(customText)}
            </p>
            {nikudLevel !== 'full' && (
              <button
                onClick={() => setNikudLevel('full')}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm text-[#001B4D] border border-[#001B4D]/20 hover:bg-white/50 transition"
              >
                <RotateCcw className="w-4 h-4" /> Show Vowels
              </button>
            )}
          </div>
        )}

        {isCustomMode && !customText && (
          <p className="text-center text-[#6b7280] py-12">Paste Hebrew text above to begin reading.</p>
        )}
      </div>

      {/* Word Bank */}
      {!isCustomMode && (
        <div className="bg-white border border-[#e5e2db] p-6">
          <h3 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-4">Word Bank</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedText.words.map((word, i) => (
              <div key={i} className="p-3 bg-[#FAFAF8] border border-[#e5e2db] rounded-lg">
                <p className="font-hebrew text-xl text-[#001B4D] text-right" dir="rtl">{word.pointed}</p>
                {word.transliteration && <p className="text-xs font-mono text-[#6b7280] mt-1">{word.transliteration}</p>}
                {word.meaning && <p className="text-xs text-[#4a4a4a] mt-0.5">{word.meaning}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
