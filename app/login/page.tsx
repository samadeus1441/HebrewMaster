'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F0E8 100%)',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🇮🇱</span>
            <span style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 700, color: '#1E3A5F' }}>Hebrew Master</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '36px 32px',
          border: '1px solid #E5E5E0',
          boxShadow: '0 2px 8px rgba(26,26,46,0.06), 0 12px 40px rgba(26,26,46,0.04)',
        }}>
          <h1 style={{
            fontFamily: '"Fraunces", serif', fontSize: 26, fontWeight: 700,
            color: '#1A1A2E', marginBottom: 4, textAlign: 'center',
          }}>
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h1>
          <p style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginBottom: 28 }}>
            {isSignUp ? 'Start your Hebrew journey' : 'Continue where you left off'}
          </p>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, marginBottom: 16,
              fontSize: 13, fontWeight: 600, textAlign: 'center',
              background: error.includes('Check') ? '#D1FAE5' : '#FFF7ED',
              color: error.includes('Check') ? '#065F46' : '#9A3412',
              border: `1px solid ${error.includes('Check') ? '#A7F3D0' : '#FDBA74'}`,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: '1px solid #E5E5E0', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.15s', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#1E3A5F'}
                onBlur={e => e.target.style.borderColor = '#E5E5E0'}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: '1px solid #E5E5E0', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.15s', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#1E3A5F'}
                onBlur={e => e.target.style.borderColor = '#E5E5E0'}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px 24px', borderRadius: 12, border: 'none',
                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
                color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(30,58,95,0.25)',
                transition: 'all 0.15s',
              }}
            >
              {loading ? 'One moment...' : isSignUp ? 'Create account' : 'Log in'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
              style={{
                background: 'none', border: 'none', fontSize: 13,
                fontWeight: 600, color: '#1E3A5F', cursor: 'pointer',
              }}
            >
              {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
