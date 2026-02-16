'use client'

import { useState, useRef } from 'react'

interface AudioPlayerProps {
  text: string
  className?: string
  lang?: string
}

export default function AudioPlayer({ text, className = '', lang = 'he' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleClick = async () => {
    setIsLoading(true)
    
    try {
      // 1. Try to fetch the audio file
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      })

      // 2. Alert if the SERVER fails (e.g. 500 or 404)
      if (!response.ok) {
        alert(`SERVER ERROR: ${response.status} ${response.statusText}`)
        setIsLoading(false)
        return
      }

      // 3. Process the file
      const audioBlob = await response.blob()
      
      // Check if the file is empty
      if (audioBlob.size < 100) {
        alert(`FILE ERROR: Audio file is too small (${audioBlob.size} bytes).`)
        setIsLoading(false)
        return
      }

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      // 4. Alert if the BROWSER refuses to play it
      audio.onerror = (e) => {
        const error = audio.error
        alert(`PLAYBACK ERROR: Code ${error?.code} - ${error?.message || 'Unknown error'}`)
        setIsLoading(false)
      }

      audio.onplay = () => {
        setIsPlaying(true)
        setIsLoading(false)
      }
      
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play().catch(e => {
        alert(`AUTOPLAY BLOCK: ${e.message}`)
        setIsLoading(false)
      })

    } catch (error: any) {
      alert(`NETWORK ERROR: ${error.message}`)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        fontSize: '18px',
      }}
    >
      {isLoading ? '⏳' : isPlaying ? '⏹️' : '🔊'}
    </button>
  )
}