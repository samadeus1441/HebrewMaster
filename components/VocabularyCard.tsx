'use client'

interface VocabularyCardProps {
  word: {
    id: string
    hebrew: string
    hebrew_unpointed: string
    transliteration?: string | null
    meaning_en?: string | null
    audio_url?: string | null
  }
}

export default function VocabularyCard({ word }: VocabularyCardProps) {
  const handleAudio = () => {
    if (word.audio_url) {
      const audio = new Audio(word.audio_url)
      audio.play().catch((err) => console.error('Audio playback failed:', err))
    } else {
      // Fallback: Use Web Speech API if no audio URL
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word.hebrew)
        utterance.lang = 'he-IL'
        speechSynthesis.speak(utterance)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative hover:shadow-md transition-shadow duration-200">
      {/* Speaker Icon Button - Top Right (RTL: left side) */}
      <button
        onClick={handleAudio}
        className="absolute top-4 left-4 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
        aria-label="Play audio"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Hebrew Text - Large and Bold */}
      <div className="mb-4 mt-4">
        <h3 className="text-3xl font-bold text-gray-900 font-hebrew text-start">
          {word.hebrew || word.hebrew_unpointed}
        </h3>
      </div>

      {/* Transliteration - Gray, Italic */}
      {word.transliteration && (
        <div className="mb-3">
          <p className="text-gray-500 italic text-sm">
            {word.transliteration}
          </p>
        </div>
      )}

      {/* English Translation - Indigo */}
      <div>
        <p className="text-indigo-600 font-medium">
          {word.meaning_en || 'No translation'}
        </p>
      </div>
    </div>
  )
}
