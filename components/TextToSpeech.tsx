// components/TextToSpeech.tsx
// ═══════════════════════════════════════════════════════════
// FIXED TTS — Uses Web Speech API (works in Chrome desktop)
// Falls back to Google Translate proxy if browser doesn't support Hebrew
// ═══════════════════════════════════════════════════════════

'use client'

import { useState, useRef, useCallback } from 'react'

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

  // Check if Web Speech API supports Hebrew
  const canUseSpeechSynthesis = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return false
    const voices = window.speechSynthesis.getVoices()
    // Hebrew voice available, or we'll try anyway (Chrome loads voices lazily)
    return voices.length === 0 || voices.some(v => v.lang.startsWith('he'))
  }, [])

  // Method 1: Web Speech API (works in Chrome, Edge, Safari)
  const playSpeechSynthesis = (textToSpeak: string): boolean => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return false

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = lang === 'yi' ? 'he' : lang === 'ar' ? 'he' : 'he-IL'
      utterance.rate = 0.85  // Slightly slower for learning
      utterance.pitch = 1

      // Try to find a Hebrew voice
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
        console.warn('SpeechSynthesis error:', e.error)
        setIsPlaying(false)
        setIsLoading(false)
        // If speech synthesis fails, try the server proxy
        playServerProxy(textToSpeak)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      return true
    } catch {
      return false
    }
  }

  // Method 2: Server proxy (Google Translate TTS) — fallback
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
      console.error('Server TTS also failed:', error)
      setIsLoading(false)
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    // Stop Speech Synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    // Stop Audio element
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

    // Try Speech Synthesis first (fast, no network needed)
    // Chrome on desktop needs voices to be loaded first
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Ensure voices are loaded
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        if (playSpeechSynthesis(text)) return
      } else {
        // Chrome loads voices async — wait for them
        window.speechSynthesis.onvoiceschanged = () => {
          if (playSpeechSynthesis(text)) return
          // If still fails, use server
          playServerProxy(text)
        }
        // Set a timeout in case onvoiceschanged never fires
        setTimeout(() => {
          if (!isPlaying) {
            if (!playSpeechSynthesis(text)) {
              playServerProxy(text)
            }
          }
        }, 300)
        return
      }
    }

    // Fallback to server proxy
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
