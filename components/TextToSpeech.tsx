'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface AudioPlayerProps {
  text: string
  autoPlay?: boolean
  className?: string
  lang?: string  // 'he' | 'yi' | 'ar' — default 'he'
}

export default function AudioPlayer({ text, autoPlay = false, className = '', lang = 'he' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // CRITICAL FIX: Chrome on Windows needs to "kickstart" the voices or they stay empty
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices()
    }
  }, [])

  const playSpeechSynthesis = (textToSpeak: string): boolean => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return false

    try {
      // 1. CLEAR PREVIOUS: Crucial for Windows Chrome to reset the engine
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      
      // Map languages
      if (lang === 'yi' || lang === 'ar') {
        utterance.lang = 'he-IL' // Use Hebrew engine for Yiddish/Aramaic fallback
      } else {
        utterance.lang = 'he-IL'
      }
      
      utterance.rate = 0.85
      utterance.pitch = 1

      const voices = window.speechSynthesis.getVoices()
      const hebrewVoice = voices.find(v => v.lang.startsWith('he'))
      if (hebrewVoice) utterance.voice = hebrewVoice

      utterance.onstart = () => {
        setIsPlaying(true)
        setIsLoading(false)
      }
      utterance.onend = () => {
        setIsPlaying(false)
        setIsLoading(false)
      }
      utterance.onerror = (e) => {
        console.error('TTS Engine Error:', e)
        setIsPlaying(false)
        setIsLoading(false)
        // If the browser engine fails, use your API proxy fallback
        playServerProxy(textToSpeak)
      }

      utteranceRef.current = utterance
      
      // 2. THE WINDOWS WAKE-UP: Resumes the engine in case it was stuck in a paused state
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance)
      return true
    } catch (err) {
      console.error('SpeechSynthesis catch block:', err)
      return false
    }
  }

  const playServerProxy = async (textToSpeak: string) => {
    try {
      setIsLoading(true)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, lang }),
      })

      if (!response.ok) throw new Error(`TTS failed: ${response.status}`)

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => { setIsPlaying(true); setIsLoading(false) }
      audio.onended = () => { setIsPlaying(false); URL.revokeObjectURL(audioUrl); audioRef.current = null }
      audio.onerror = () => { setIsPlaying(false); setIsLoading(false); URL.revokeObjectURL(audioUrl); audioRef.current = null }

      await audio.play()
    } catch (error) {
      console.error('Server TTS fallback failed:', error)
      setIsLoading(false)
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setIsLoading(false)
  }

  const handleClick = () => {
    if (!text) return
    if (isPlaying) { handleStop(); return }

    setIsLoading(true)

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        if (playSpeechSynthesis(text)) return
      } else {
        // Handle lazy loading of voices in Chrome
        window.speechSynthesis.onvoiceschanged = () => {
          if (playSpeechSynthesis(text)) return
          playServerProxy(text)
        }
        setTimeout(() => {
          if (!isPlaying) {
            if (!playSpeechSynthesis(text)) playServerProxy(text)
          }
        }, 500)
        return
      }
    }
    playServerProxy(text)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: isLoading ? 'wait' : 'pointer',
        padding: '4px',
        fontSize: '18px',
        opacity: isLoading ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
      title={isPlaying ? 'Stop' : 'Listen'}
    >
      {isLoading ? '⏳' : isPlaying ? '⏹️' : '🔊'}
    </button>
  )
}