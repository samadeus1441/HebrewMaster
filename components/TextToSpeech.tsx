'use client'

import { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
  text: string
  autoPlay?: boolean
  className?: string
  lang?: string  // 'he' | 'yi' | 'ar' — default 'he'
}

export default function AudioPlayer({ text, className = '', lang = 'he' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 1. Force-load voices immediately on mount (fixes empty voice list)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices()
    }
  }, [])

  const handleStop = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel()
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
  }

  const handleClick = () => {
    if (isPlaying) {
      handleStop()
      return
    }

    // 2. IMMEDIATE EXECUTION: No waiting, no timeouts.
    // This keeps the "User Activation" token valid for Chrome.
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Crucial: Cancel then Resume synchronously
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()

      const utterance = new SpeechSynthesisUtterance(text)
      // Force Hebrew locale
      utterance.lang = 'he-IL' 
      utterance.rate = 0.85

      // Try to find a voice, but do NOT wait for it. 
      // If we wait, Chrome blocks the sound.
      const voices = window.speechSynthesis.getVoices()
      const hebrewVoice = voices.find(v => v.lang.includes('he'))
      if (hebrewVoice) utterance.voice = hebrewVoice

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      
      // If the browser fails (e.g. missing language pack), instantly use Server Proxy
      utterance.onerror = () => {
        setIsPlaying(false)
        playServerProxy()
      }

      // FIRE!
      window.speechSynthesis.speak(utterance)
    } else {
      // Fallback if browser doesn't support speech at all
      playServerProxy()
    }
  }

  const playServerProxy = async () => {
    try {
      if (audioRef.current) audioRef.current.pause()
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
      
      await audio.play()
    } catch (error) {
      console.error('Proxy failed:', error)
      setIsPlaying(false)
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
      {isPlaying ? '⏹️' : '🔊'}
    </button>
  )
}