'use client'

import { useEffect, useState, useRef } from 'react'

interface AudioPlayerProps {
  text: string
  autoPlay?: boolean
  className?: string
}

export default function AudioPlayer({ text, autoPlay = false, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = async (textToSpeak: string) => {
    if (!textToSpeak) return

    try {
      setIsLoading(true)

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      // Fetch audio from ElevenLabs TTS API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToSpeak }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`)
      }

      // Get the audio blob
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Create and play audio
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => {
        setIsPlaying(true)
        setIsLoading(false)
      }

      audio.onended = () => {
        setIsPlaying(false)
        setIsLoading(false)
        // Clean up the object URL
        URL.revokeObjectURL(audioUrl)
        audioRef.current = null
      }

      audio.onerror = (error) => {
        console.error('Audio playback error:', error)
        setIsPlaying(false)
        setIsLoading(false)
        URL.revokeObjectURL(audioUrl)
        audioRef.current = null
      }

      await audio.play()
    } catch (error: any) {
      console.error('Error playing audio:', error)
      setIsLoading(false)
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    if (isPlaying || isLoading) {
      handleStop()
    } else {
      playAudio(text)
    }
  }

  // Auto-play when text changes and autoPlay is true
  useEffect(() => {
    if (autoPlay && text) {
      // Small delay to ensure component is ready
      const timer = setTimeout(() => {
        playAudio(text)
      }, 300)

      return () => {
        clearTimeout(timer)
        handleStop()
      }
    }
  }, [text, autoPlay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleStop()
      if (audioRef.current) {
        audioRef.current = null
      }
    }
  }, [])

  const buttonClass = `
    p-3 rounded-lg transition-all duration-200 ${className}
    ${
      isLoading
        ? 'bg-indigo-100 text-indigo-600 cursor-wait'
        : isPlaying
        ? 'bg-indigo-100 text-indigo-600 animate-pulse'
        : 'bg-gray-100 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'
    }
  `

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={buttonClass}
      aria-label={isLoading ? 'Loading audio...' : isPlaying ? 'Stop audio' : 'Play audio'}
    >
      {isLoading ? (
        // Loading spinner
        <svg
          className="animate-spin h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : isPlaying ? (
        // Stop icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V7a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Speaker icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  )
}
