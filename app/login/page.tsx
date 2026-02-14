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

  // 1. THIS IS THE NEW GOOGLE FUNCTION
  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // This redirects back to your site after Google login
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

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

          {/* 2. GOOGLE BUTTON ADDED HERE */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', marginBottom: '20px',
              background: 'white', border: '1px solid #E5E5E0', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              cursor: loading ? 'wait' : 'pointer', fontWeight: 600, color: '#1A1A2E',
              fontSize: 15, transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
          >
             {/* Google Icon SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* 3. OR DIVIDER */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#E5E5E0' }}>
            <div style={{ flex: 1, height: 1, background: '#E5E5E0' }}></div>
            <span style={{ padding: '0 10px', fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#E5E5E0' }}></div>
          </div>

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