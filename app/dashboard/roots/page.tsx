'use client'

import { useState } from 'react'
import { Search, BookOpen, ArrowRight, Sparkles } from 'lucide-react'

type DerivedWord = {
  word: string
  pointed: string
  transliteration: string
  meaning: string
  binyan?: string
  partOfSpeech: string
  language: 'modern' | 'biblical' | 'both'
}

type RootEntry = {
  root: string
  rootPointed: string
  coreMeaning: string
  derivatives: DerivedWord[]
}

// Sample data — in production, this comes from Supabase
const SAMPLE_ROOTS: RootEntry[] = [
  {
    root: 'כ.ת.ב',
    rootPointed: 'כ.ת.ב',
    coreMeaning: 'write / inscription',
    derivatives: [
      { word: 'כָּתַב', pointed: 'כָּתַב', transliteration: 'katav', meaning: 'he wrote', binyan: "Pa'al", partOfSpeech: 'verb', language: 'both' },
      { word: 'כּוֹתֵב', pointed: 'כּוֹתֵב', transliteration: 'kotev', meaning: 'writes / writing', binyan: "Pa'al", partOfSpeech: 'verb', language: 'modern' },
      { word: 'נִכְתַּב', pointed: 'נִכְתַּב', transliteration: 'nikhtav', meaning: 'was written', binyan: "Nif'al", partOfSpeech: 'verb', language: 'both' },
      { word: 'הִכְתִּיב', pointed: 'הִכְתִּיב', transliteration: 'hikhtiv', meaning: 'dictated', binyan: "Hif'il", partOfSpeech: 'verb', language: 'modern' },
      { word: 'כְּתָב', pointed: 'כְּתָב', transliteration: 'ktav', meaning: 'handwriting / script', partOfSpeech: 'noun', language: 'both' },
      { word: 'מִכְתָּב', pointed: 'מִכְתָּב', transliteration: 'mikhtav', meaning: 'letter (correspondence)', partOfSpeech: 'noun', language: 'both' },
      { word: 'כַּתָּב', pointed: 'כַּתָּב', transliteration: 'katav', meaning: 'reporter / journalist', partOfSpeech: 'noun', language: 'modern' },
      { word: 'כְּתוּבָה', pointed: 'כְּתוּבָה', transliteration: 'ketuba', meaning: 'marriage contract', partOfSpeech: 'noun', language: 'both' },
      { word: 'כָּתוּב', pointed: 'כָּתוּב', transliteration: 'katuv', meaning: 'written / scripture', partOfSpeech: 'adjective', language: 'both' },
      { word: 'הַכְתָּבָה', pointed: 'הַכְתָּבָה', transliteration: 'hakhtava', meaning: 'dictation', partOfSpeech: 'noun', language: 'modern' },
    ],
  },
  {
    root: 'ל.מ.ד',
    rootPointed: 'ל.מ.ד',
    coreMeaning: 'learn / teach / study',
    derivatives: [
      { word: 'לָמַד', pointed: 'לָמַד', transliteration: 'lamad', meaning: 'he learned', binyan: "Pa'al", partOfSpeech: 'verb', language: 'both' },
      { word: 'לִמֵּד', pointed: 'לִמֵּד', transliteration: 'limed', meaning: 'he taught', binyan: "Pi'el", partOfSpeech: 'verb', language: 'both' },
      { word: 'תַּלְמִיד', pointed: 'תַּלְמִיד', transliteration: 'talmid', meaning: 'student', partOfSpeech: 'noun', language: 'both' },
      { word: 'תַּלְמוּד', pointed: 'תַּלְמוּד', transliteration: 'talmud', meaning: 'Talmud (study)', partOfSpeech: 'noun', language: 'both' },
      { word: 'מְלַמֵּד', pointed: 'מְלַמֵּד', transliteration: 'melamed', meaning: 'teacher', partOfSpeech: 'noun', language: 'both' },
      { word: 'לִימוּד', pointed: 'לִימוּד', transliteration: 'limud', meaning: 'study / learning', partOfSpeech: 'noun', language: 'both' },
      { word: 'מַדָּע', pointed: 'מַדָּע', transliteration: "mada", meaning: 'science (knowledge)', partOfSpeech: 'noun', language: 'modern' },
    ],
  },
  {
    root: 'ש.מ.ר',
    rootPointed: 'ש.מ.ר',
    coreMeaning: 'guard / keep / observe',
    derivatives: [
      { word: 'שָׁמַר', pointed: 'שָׁמַר', transliteration: 'shamar', meaning: 'he guarded', binyan: "Pa'al", partOfSpeech: 'verb', language: 'both' },
      { word: 'נִשְׁמַר', pointed: 'נִשְׁמַר', transliteration: 'nishmar', meaning: 'was careful / guarded', binyan: "Nif'al", partOfSpeech: 'verb', language: 'both' },
      { word: 'שׁוֹמֵר', pointed: 'שׁוֹמֵר', transliteration: 'shomer', meaning: 'guard / keeper', partOfSpeech: 'noun', language: 'both' },
      { word: 'מִשְׁמֶרֶת', pointed: 'מִשְׁמֶרֶת', transliteration: 'mishmeret', meaning: 'watch / shift / duty', partOfSpeech: 'noun', language: 'both' },
      { word: 'שְׁמִירָה', pointed: 'שְׁמִירָה', transliteration: 'shmira', meaning: 'guarding / security', partOfSpeech: 'noun', language: 'modern' },
      { word: 'שִׁמּוּר', pointed: 'שִׁמּוּר', transliteration: 'shimur', meaning: 'preservation / conservation', partOfSpeech: 'noun', language: 'modern' },
    ],
  },
]

const BINYAN_COLORS: Record<string, string> = {
  "Pa'al": 'bg-blue-100 text-blue-800',
  "Nif'al": 'bg-purple-100 text-purple-800',
  "Pi'el": 'bg-amber-100 text-amber-800',
  "Pu'al": 'bg-orange-100 text-orange-800',
  "Hif'il": 'bg-emerald-100 text-emerald-800',
  "Huf'al": 'bg-teal-100 text-teal-800',
  "Hitpa'el": 'bg-rose-100 text-rose-800',
}

const POS_COLORS: Record<string, string> = {
  verb: 'bg-[#001B4D]/10 text-[#001B4D]',
  noun: 'bg-[#CFBA8C]/20 text-[#8a6b2f]',
  adjective: 'bg-[#9BAB16]/15 text-[#6b7a0e]',
}

export default function RootsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoot, setSelectedRoot] = useState<RootEntry>(SAMPLE_ROOTS[0])
  const [filterPos, setFilterPos] = useState<string>('all')
  const [filterLang, setFilterLang] = useState<string>('all')

  const filteredDerivatives = selectedRoot.derivatives.filter(d => {
    if (filterPos !== 'all' && d.partOfSpeech !== filterPos) return false
    if (filterLang !== 'all' && d.language !== filterLang && d.language !== 'both') return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-[#001B4D]">Root Explorer</h1>
        <p className="text-[#6b7280] mt-1">
          Discover how three letters branch into an entire family of words across Hebrew and Aramaic.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#e5e2db] p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search roots (e.g. כתב, write, ktv)..."
            className="w-full pl-10 pr-4 py-3 border border-[#e5e2db] text-sm focus:border-[#001B4D] focus:outline-none transition bg-[#FAFAF8]"
            dir="auto"
          />
        </div>
        {/* Quick Roots */}
        <div className="flex flex-wrap gap-2 mt-3">
          {SAMPLE_ROOTS.map(r => (
            <button
              key={r.root}
              onClick={() => setSelectedRoot(r)}
              className={`px-4 py-2 text-sm font-semibold border transition ${
                selectedRoot.root === r.root
                  ? 'bg-[#001B4D] text-white border-[#001B4D]'
                  : 'border-[#e5e2db] text-[#001B4D] hover:border-[#CFBA8C]'
              }`}
            >
              <span className="font-hebrew">{r.root}</span>
              <span className="text-xs ml-2 opacity-70">({r.coreMeaning})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Root Visualization */}
      <div className="bg-[#FBF3D4] border border-[#CFBA8C]/30 p-8 text-center">
        <div className="mb-2">
          <span className="text-xs font-semibold text-[#001B4D]/50 uppercase tracking-wider">Root</span>
        </div>
        <div className="font-hebrew text-6xl md:text-7xl text-[#001B4D] mb-3" dir="rtl">
          {selectedRoot.root}
        </div>
        <p className="text-lg text-[#4a4a4a] italic">"{selectedRoot.coreMeaning}"</p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="px-3 py-1 bg-white/60 text-xs font-semibold text-[#001B4D] rounded-full">
            {selectedRoot.derivatives.length} derivatives
          </span>
          <span className="px-3 py-1 bg-white/60 text-xs font-semibold text-[#001B4D] rounded-full">
            {selectedRoot.derivatives.filter(d => d.binyan).map(d => d.binyan).filter((v, i, a) => a.indexOf(v) === i).length} binyanim
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterPos}
          onChange={e => setFilterPos(e.target.value)}
          className="px-3 py-2 border border-[#e5e2db] text-sm bg-white focus:border-[#001B4D] focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="verb">Verbs</option>
          <option value="noun">Nouns</option>
          <option value="adjective">Adjectives</option>
        </select>
        <select
          value={filterLang}
          onChange={e => setFilterLang(e.target.value)}
          className="px-3 py-2 border border-[#e5e2db] text-sm bg-white focus:border-[#001B4D] focus:outline-none"
        >
          <option value="all">All Eras</option>
          <option value="modern">Modern Hebrew</option>
          <option value="biblical">Biblical Hebrew</option>
        </select>
      </div>

      {/* Derivatives Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredDerivatives.map((d, i) => (
          <div key={i} className="bg-white border border-[#e5e2db] p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-hebrew text-2xl text-[#001B4D]" dir="rtl">{d.pointed}</p>
                <p className="text-sm font-mono text-[#6b7280] mt-1">{d.transliteration}</p>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${POS_COLORS[d.partOfSpeech] || 'bg-gray-100 text-gray-600'}`}>
                  {d.partOfSpeech}
                </span>
                {d.binyan && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${BINYAN_COLORS[d.binyan] || 'bg-gray-100 text-gray-600'}`}>
                    {d.binyan}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-[#4a4a4a] mt-2">{d.meaning}</p>
            <div className="mt-2 flex items-center gap-1">
              {d.language === 'modern' && <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 font-semibold rounded">Modern</span>}
              {d.language === 'biblical' && <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 font-semibold rounded">Biblical</span>}
              {d.language === 'both' && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded">Both</span>}
            </div>
          </div>
        ))}
      </div>

      {filteredDerivatives.length === 0 && (
        <p className="text-center text-[#6b7280] py-8">No derivatives match your filters.</p>
      )}
    </div>
  )
}
