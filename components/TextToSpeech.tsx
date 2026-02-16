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

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setIsLoading(false)
  }

  const handleClick = async () => {
    // 1. If already playing, stop it.
    if (isPlaying) {
      handleStop()
      return
    }

    setIsLoading(true)

    try {
      // 2. FORCE SERVER API: Ignore the browser voices. Just get the MP3.
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      })

      if (!response.ok) throw new Error('TTS API failed')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => {
        setIsPlaying(true)
        setIsLoading(false)
      }
      
      audio.onended = () => {
        setIsPlaying(false)
        setIsLoading(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        console.error('Audio file failed to load')
        setIsPlaying(false)
        setIsLoading(false)
      }
      
      await audio.play()

    } catch (error) {
      console.error('Server TTS failed:', error)
      setIsPlaying(false)
      setIsLoading(false)
    }
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
      }}
    >
      {isLoading ? '⏳' : isPlaying ? '⏹️' : '🔊'}
    </button>
  )
}