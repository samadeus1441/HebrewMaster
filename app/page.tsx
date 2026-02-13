'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } }

export default function LandingPage() {
  return (
    <main style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#1A1A2E' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(229,229,224,0.6)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🇮🇱</span>
            <span style={{ fontFamily: '"Fraunces", serif', fontSize: 18, fontWeight: 700, color: '#1E3A5F', letterSpacing: '-0.02em' }}>Hebrew Master</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', textDecoration: 'none' }}>Log in</Link>
            <Link href="/login" style={{
              fontSize: 14, fontWeight: 700, color: 'white', textDecoration: 'none',
              background: '#1E3A5F', padding: '9px 20px', borderRadius: 10,
            }}>Start learning</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: 140, paddingBottom: 80, textAlign: 'center',
        background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F0E8 50%, #FAFAF8 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle Jerusalem stone texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\'/%3E%3Cpath d=\'M20 0v40M0 20h40\' stroke=\'%23CFBA8C\' stroke-width=\'0.5\'/%3E%3C/svg%3E")',
        }} />

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <motion.div {...fadeUp}>
            <div style={{
              display: 'inline-block', background: '#FEF3C7', color: '#92400E',
              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700,
              marginBottom: 24, letterSpacing: '0.02em',
            }}>
              Not another language app
            </div>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} style={{
            fontFamily: '"Fraunces", serif', fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: '#1A1A2E', marginBottom: 20,
          }}>
            Your Hebrew.<br />
            <span style={{ color: '#1E3A5F' }}>Your lessons.</span><br />
            {/* Added direction RTL for Hebrew */}
            <span style={{
              fontFamily: '"Frank Ruhl Libre", serif', color: '#CFBA8C',
              fontSize: 'clamp(40px, 7vw, 64px)',
              direction: 'rtl', display: 'inline-block'
            }}>המילים שלך</span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }} style={{
            fontSize: 18, lineHeight: 1.7, color: '#6B7280', maxWidth: 520,
            margin: '0 auto 36px',
          }}>
            Every word on your dashboard came from YOUR real lesson with YOUR teacher. 
            Not random vocabulary lists. Your words, your mistakes, your progress.
          </motion.p>

          <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.5 }} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{
              background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)', color: 'white',
              padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700,
              textDecoration: 'none', boxShadow: '0 4px 16px rgba(30,58,95,0.25)',
              transition: 'opacity 0.15s',
            }}>Enter your classroom →</Link>
          </motion.div>
        </div>
      </section>

      {/* What Makes This Different */}
      <section style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
            What Duolingo can't do
          </h2>
          <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 500, margin: '0 auto' }}>
            Generic apps teach the same 2000 words to everyone. 
            Hebrew Master teaches the words from YOUR actual lessons.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            {
              icon: '📚', title: 'Your Lessons, Visualized',
              desc: 'After each lesson with your teacher, your vocabulary, strengths, and areas to improve appear on your personal dashboard. Every lesson is a chapter in your story.',
            },
            {
              icon: '🃏', title: 'Personalized Flashcards',
              desc: "Spaced repetition flashcards built from YOUR lesson vocabulary. The algorithm shows you words right before you'd forget them.",
            },
            {
              icon: '🎯', title: 'Quizzes That Adapt',
              desc: 'Test yourself on words from specific lessons or everything you\'ve learned. Earn XP, level up through the Hebrew alphabet.',
            },
            {
              icon: '💬', title: 'Real Conversations',
              desc: 'Practice scenarios your teacher designed for YOU — ordering at the shuk, talking with family, navigating Israeli culture.',
            },
            {
              icon: '📊', title: 'See Your Growth',
              desc: 'Track your talk ratio, Hebrew percentage, and vocabulary mastery across every lesson. Watch yourself improve.',
            },
            {
              icon: '🏆', title: 'Gamified Journey',
              desc: 'Level up through all 22 Hebrew letters — from Alef to Tav. Earn XP for every review, every quiz, every conversation.',
            },
          ].map((feat, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05, duration: 0.4 }} style={{
              background: 'white', borderRadius: 18, padding: '28px 24px',
              border: '1px solid #E5E5E0', boxShadow: '0 1px 3px rgba(26,26,46,0.04)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,26,46,0.08)'; e.currentTarget.style.borderColor = 'rgba(30,58,95,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(26,26,46,0.04)'; e.currentTarget.style.borderColor = '#E5E5E0' }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{feat.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>{feat.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#6B7280' }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Teacher — Jerusalem Bridge narrative */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #FAFAF8 0%, #F5F0E8 100%)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <motion.div {...fadeUp}>
            <div style={{
              fontFamily: '"Frank Ruhl Libre", serif', fontSize: 28, color: '#CFBA8C',
              marginBottom: 16, direction: 'rtl'
            }}>הגשר הירושלמי</div>
            <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Your Teacher
            </h2>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.1 }} style={{
            background: 'white', borderRadius: 20, padding: '36px 32px',
            border: '1px solid #E5E5E0', boxShadow: '0 2px 12px rgba(26,26,46,0.05)',
            textAlign: 'left',
          }}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#4B5563', marginBottom: 16 }}>
              Born and raised in Jerusalem to a family with deep roots in the Old Yishuv, 
              I grew up speaking Hebrew, Yiddish, English, and French. I've lived between 
              worlds my whole life — from the ancient stones of the Old City to cosmopolitan 
              life in France.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#4B5563', marginBottom: 16 }}>
              My teaching isn't about memorizing conjugation tables. It's about <strong>activating</strong> the 
              Hebrew you already have inside you. We'll use real conversations, roleplay, and cultural 
              context to unlock your fluency — not textbook exercises.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#4B5563' }}>
              Whether you're connecting with family in Israel, studying Torah in the original, 
              or preparing for aliyah — I meet you where you are and take you where you want to go.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.2 }} style={{ marginTop: 28, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Conversational Hebrew', 'Biblical Hebrew', 'Yiddish', 'French-Hebrew'].map(tag => (
              <span key={tag} style={{
                background: 'white', border: '1px solid #E5E5E0', borderRadius: 20,
                padding: '6px 16px', fontSize: 13, fontWeight: 600, color: '#1E3A5F',
              }}>{tag}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <motion.h2 {...fadeUp} style={{
          fontFamily: '"Fraunces", serif', fontSize: 32, fontWeight: 700,
          textAlign: 'center', marginBottom: 48, letterSpacing: '-0.02em',
        }}>How it works</motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[
            { num: '01', title: 'Take a lesson', desc: 'Have a live Hebrew lesson with your teacher via Preply, Zoom, or in person.' },
            { num: '02', title: 'We analyze it', desc: 'Your lesson is analyzed and broken down — vocabulary extracted, strengths identified, struggles noted.' },
            { num: '03', title: 'Your dashboard updates', desc: 'Log in to find personalized flashcards, quiz questions, and conversation practice all based on YOUR lesson.' },
            { num: '04', title: 'Practice between lessons', desc: 'Review your words with spaced repetition, test yourself with quizzes, earn XP. Come to your next lesson sharper.' },
          ].map((step, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{
                fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 800,
                color: '#CFBA8C', minWidth: 48, marginTop: 2,
              }}>{step.num}</div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>{step.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: '#6B7280' }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '60px 24px', textAlign: 'center',
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F8A 100%)',
      }}>
        <motion.div {...fadeUp} style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: '"Fraunces", serif', fontSize: 30, fontWeight: 700,
            color: 'white', marginBottom: 12,
          }}>Ready to start?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: 28, lineHeight: 1.6 }}>
            Book a trial lesson and get your personalized learning dashboard.
          </p>
          <Link href="/login" style={{
            display: 'inline-block', background: 'white', color: '#1E3A5F',
            padding: '14px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700,
            textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}>Enter your classroom →</Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px', textAlign: 'center',
        borderTop: '1px solid #E5E5E0', background: '#FAFAF8',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>🇮🇱</span>
          <span style={{ fontFamily: '"Fraunces", serif', fontSize: 14, fontWeight: 600, color: '#1E3A5F' }}>Hebrew Master</span>
        </div>
        <p style={{ fontSize: 12, color: '#9CA3AF' }}>Made in Jerusalem. Taught from the heart.</p>
      </footer>
    </main>
  )
}