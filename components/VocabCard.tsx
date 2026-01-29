'use client'

import TextToSpeech from './TextToSpeech'

interface VocabCardProps {
  word: {
    id: string
    hebrew: string
    hebrew_unpointed: string
    transliteration?: string | null
    meaning_en?: string | null
    part_of_speech?: string | null
    root?: {
      root_letters: string
    } | null
  }
}

export default function VocabCard({ word }: VocabCardProps) {
  // Format root letters with hyphens (e.g., "כ-ת-ב")
  const formatRoot = (rootLetters: string) => {
    return rootLetters.split('').join('-')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 relative hover:shadow-lg transition-all duration-300 group">
      {/* Part of Speech Tag - Top Left (RTL: top right) */}
      {word.part_of_speech && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider rounded-full">
            {word.part_of_speech}
          </span>
        </div>
      )}

      {/* TextToSpeech Button - Top Left (RTL: top left) */}
      <div className="absolute top-4 left-4">
        <TextToSpeech text={word.hebrew || word.hebrew_unpointed} />
      </div>

      {/* Hebrew Text - HUGE and Centered, Frank Ruhl Libre */}
      <div className="text-center mb-6 mt-12">
        <h3 className="text-4xl font-bold text-gray-900 font-serif leading-tight">
          {word.hebrew || word.hebrew_unpointed}
        </h3>
      </div>

      {/* Transliteration - Centered, Gray */}
      {word.transliteration && (
        <div className="text-center mb-4">
          <p className="text-gray-500 italic text-sm">
            {word.transliteration}
          </p>
        </div>
      )}

      {/* English Translation - Centered, Indigo */}
      <div className="text-center mb-6">
        <p className="text-indigo-600 font-semibold text-lg">
          {word.meaning_en || 'No translation'}
        </p>
      </div>

      {/* Root Badge - Bottom */}
      {word.root && word.root.root_letters && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
            Root: {formatRoot(word.root.root_letters)}
          </span>
        </div>
      )}
    </div>
  )
}
