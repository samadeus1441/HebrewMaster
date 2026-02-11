'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

export default function MyLessonsPage() {
  const [lessons, setLessons] = useState<any[]>([])
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAllCards, setShowAllCards] = useState<Record<string, boolean>>({})

  useEffect(() => { loadLessons() }, [])

  async function loadLessons() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: lessonRows } = await supabase
      .from('lessons')
      .select('*')
      .eq('student_user_id', user.id)
      .not('status', 'eq', 'transcribing')
      .order('lesson_number', { ascending: false })

    if (!lessonRows || lessonRows.length === 0) {
      // Fallback: group SRS cards by date
      const { data: cardData } = await supabase
        .from('srs_cards')
        .select('*')
        .eq('user_id', user.id)
        .eq('source', 'lesson')
        .order('created_at', { ascending: false })

      if (cardData && cardData.length > 0) {
        const groups: Record<string, any[]> = {}
        cardData.forEach(card => {
          const date = new Date(card.created_at).toISOString().split('T')[0]
          if (!groups[date]) groups[date] = []
          groups[date].push(card)
        })
        const fallback = Object.entries(groups)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, cards], i, arr) => ({
            id: `g-${date}`,
            lesson_number: arr.length - i,
            lesson_date: date,
            topic_title: `Lesson ${arr.length - i}`,
            summary: '',
            analysis: null,
            vocabulary: null,
            strengths: null,
            struggles: null,
            talk_ratio_student: null,
            hebrew_percentage: null,
            cards: cards.map(c => ({
              id: c.id, front: c.front || '', back: c.back || '',
              transliteration: c.transliteration || '', category: c.category || '',
              reps: c.reps || 0, stability: c.stability || 0,
            })),
          }))
        setLessons(fallback)
      }
      setLoading(false)
      return
    }

    // Enrich lessons with their cards
    const enriched = []
    for (const lesson of lessonRows) {
      const { data: junction } = await supabase
        .from('lesson_cards')
        .select('card_id')
        .eq('lesson_id', lesson.id)

      let cards: any[] = []
      if (junction && junction.length > 0) {
        const { data: cardRows } = await supabase
          .from('srs_cards')
          .select('*')
          .in('id', junction.map(j => j.card_id))

        cards = (cardRows || []).map(c => ({
          id: c.id, front: c.front || '', back: c.back || '',
          transliteration: c.transliteration || '', category: c.category || '',
          reps: c.reps || 0, stability: c.stability || 0,
        }))
      }

      // Parse analysis JSON if strengths/struggles aren't in separate columns
      let strengths = lesson.strengths
      let struggles = lesson.struggles
      let talkRatio = lesson.talk_ratio_student
      let hebrewPct = lesson.hebrew_percentage
      let recommendations = lesson.recommendations

      if (!strengths && lesson.analysis) {
        const a = typeof lesson.analysis === 'string' ? JSON.parse(lesson.analysis) : lesson.analysis
        strengths = a.strengths || []
        struggles = a.struggles || []
        talkRatio = a.talk_ratio?.student
        hebrewPct = a.hebrew_percentage
        recommendations = a.recommendations || []
      }

      enriched.push({
        ...lesson,
        strengths,
        struggles,
        recommendations,
        talk_ratio_student: talkRatio,
        hebrew_percentage: hebrewPct,
        cards,
      })
    }

    setLessons(enriched)
    if (enriched.length > 0) setExpandedLesson(enriched[0].id)
    setLoading(false)
  }

  const catColors: Record<string, string> = {
    family: '#E8D5B7', commands: '#B7D5E8', encouragement: '#D5E8B7',
    warnings: '#E8B7B7', play: '#D5B7E8', phrases: '#B7E8D5',
    verbs: '#E8D5D5', adjectives: '#D5D5E8', expressions: '#E8E8B7',
    greetings: '#B7E8E8', shopping: '#E8C5B7', travel: '#C5E8B7',
    'essential phrases': '#B7C5E8', 'daily life': '#E8B7C5',
    hobbies: '#B7E8C5', nouns: '#D5C5B7', colloquial: '#C5D5B7',
    'time expressions': '#C5B7E8',
  }

  const getMastery = (c: any) => {
    if (c.stability >= 5) return { color: '#10B981', label: 'Mastered' }
    if (c.reps >= 3) return { color: '#F59E0B', label: 'Reviewing' }
    if (c.reps >= 1) return { color: '#9CA3AF', label: 'Seen' }
    return { color: '#3B82F6', label: 'New' }
  }

  const playAudio = (text: string) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'he-IL'; u.rate = 0.85
    window.speechSynthesis.speak(u)
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--hm-border)', borderTopColor: 'var(--hm-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ marginTop: 14, color: 'var(--hm-text-muted)', fontSize: 13 }}>Loading your lessons...</p>
    </div>
  )

  if (lessons.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>📚</div>
      <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 28, fontWeight: 700, color: 'var(--hm-text)', marginBottom: 8 }}>Your lessons will appear here</h1>
      <p style={{ color: 'var(--hm-text-secondary)', fontSize: 15, maxWidth: 400, lineHeight: 1.6 }}>
        After each lesson with your teacher, personalized vocabulary and notes from YOUR lesson will show up here.
      </p>
    </div>
  )

  const totalWords = lessons.reduce((s, l) => s + l.cards.length, 0)

  return (
    <div style={{ padding: '32px 28px', maxWidth: 840, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 32, fontWeight: 700, color: 'var(--hm-text)', marginBottom: 4 }}>My Lessons</h1>
        <p style={{ color: 'var(--hm-text-secondary)', fontSize: 14 }}>
          {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} · {totalWords} words learned
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {lessons.map((lesson, idx) => {
          const isOpen = expandedLesson === lesson.id
          const showAll = showAllCards[lesson.id]
          const visible = showAll ? lesson.cards : lesson.cards.slice(0, 8)
          const cats = [...new Set(lesson.cards.map((c: any) => c.category))].filter(Boolean)

          return (
            <motion.div key={lesson.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
              <div className="hm-card" style={{ overflow: 'hidden' }}>
                {/* Header */}
                <button onClick={() => setExpandedLesson(isOpen ? null : lesson.id)} style={{
                  display: 'flex', width: '100%', padding: '22px 24px', background: 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left', alignItems: 'flex-start', gap: 16,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 13,
                    background: 'linear-gradient(135deg, var(--hm-blue), var(--hm-blue-light))',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 700, flexShrink: 0,
                  }}>{lesson.lesson_number}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 18, fontWeight: 600, color: 'var(--hm-text)', margin: 0 }}>
                      {lesson.topic_title || `Lesson ${lesson.lesson_number}`}
                    </h2>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--hm-text-muted)', marginTop: 4, flexWrap: 'wrap' }}>
                      <span>{fmtDate(lesson.lesson_date)}</span>
                      <span>·</span>
                      <span>{lesson.cards.length} words</span>
                      {lesson.talk_ratio_student && <>
                        <span>·</span>
                        <span>Talk: {lesson.talk_ratio_student}%{lesson.talk_ratio_student >= 50 ? ' 🟢' : lesson.talk_ratio_student >= 35 ? ' 🟡' : ' 🔴'}</span>
                      </>}
                      {lesson.hebrew_percentage && <>
                        <span>·</span><span>Hebrew: {lesson.hebrew_percentage}%</span>
                      </>}
                    </div>
                    {cats.length > 0 && (
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
                        {cats.slice(0, 5).map((cat: string) => (
                          <span key={cat} style={{
                            padding: '2px 9px', borderRadius: 16, background: catColors[cat] || '#E5E5E0',
                            fontSize: 10, fontWeight: 600, color: 'var(--hm-text)', textTransform: 'capitalize',
                          }}>{cat}</span>
                        ))}
                        {cats.length > 5 && <span style={{ padding: '2px 9px', borderRadius: 16, background: '#F0F0EC', fontSize: 10, fontWeight: 600, color: 'var(--hm-text-muted)' }}>+{cats.length - 5}</span>}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--hm-text-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : '', flexShrink: 0, marginTop: 6 }}>▾</div>
                </button>

                {/* Expanded */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--hm-border)', paddingTop: 20 }}>

                        {/* Summary */}
                        {lesson.summary && (
                          <div style={{ marginBottom: 20 }}>
                            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--hm-text-muted)', marginBottom: 6 }}>Summary</h3>
                            <p style={{ fontSize: 13, color: 'var(--hm-text-secondary)', lineHeight: 1.7 }}>{lesson.summary}</p>
                          </div>
                        )}

                        {/* Strengths & Struggles */}
                        {((lesson.strengths?.length > 0) || (lesson.struggles?.length > 0)) && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                            {lesson.strengths?.length > 0 && (
                              <div style={{ background: '#F0FDF4', borderRadius: 12, padding: 14, border: '1px solid #BBF7D0' }}>
                                <h4 style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>💪 Strengths</h4>
                                {lesson.strengths.slice(0, 4).map((s: string, i: number) => (
                                  <p key={i} style={{ fontSize: 12, color: '#374151', margin: '3px 0', lineHeight: 1.5 }}>• {s}</p>
                                ))}
                              </div>
                            )}
                            {lesson.struggles?.length > 0 && (
                              <div style={{ background: '#FFF7ED', borderRadius: 12, padding: 14, border: '1px solid #FED7AA' }}>
                                <h4 style={{ fontSize: 11, fontWeight: 700, color: '#EA580C', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🎯 Working On</h4>
                                {lesson.struggles.slice(0, 4).map((s: string, i: number) => (
                                  <p key={i} style={{ fontSize: 12, color: '#374151', margin: '3px 0', lineHeight: 1.5 }}>• {s}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Vocabulary Grid */}
                        {lesson.cards.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--hm-text-muted)', marginBottom: 10 }}>
                              Vocabulary ({lesson.cards.length} words)
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8 }}>
                              {visible.map((card: any) => {
                                const m = getMastery(card)
                                return (
                                  <div key={card.id} onClick={() => playAudio(card.front)} style={{
                                    background: 'var(--hm-bg)', borderRadius: 10, padding: '12px 14px',
                                    border: '1px solid var(--hm-border)', cursor: 'pointer',
                                    transition: 'all 0.15s', position: 'relative',
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hm-blue)'; e.currentTarget.style.background = 'white' }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hm-border)'; e.currentTarget.style.background = 'var(--hm-bg)' }}
                                  >
                                    <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: m.color }} title={m.label} />
                                    <div style={{ fontFamily: '"Frank Ruhl Libre", serif', fontSize: 20, color: 'var(--hm-text)', direction: 'rtl', marginBottom: 3 }}>{card.front}</div>
                                    {card.transliteration && <div style={{ fontSize: 11, color: 'var(--hm-text-muted)', fontStyle: 'italic', marginBottom: 3 }}>{card.transliteration}</div>}
                                    <div style={{ fontSize: 12, color: 'var(--hm-text-secondary)', fontWeight: 500 }}>{card.back}</div>
                                    <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 13, opacity: 0.25 }}>🔊</div>
                                  </div>
                                )
                              })}
                            </div>
                            {lesson.cards.length > 8 && (
                              <button onClick={() => setShowAllCards(p => ({ ...p, [lesson.id]: !p[lesson.id] }))} style={{
                                display: 'block', margin: '12px auto 0', padding: '7px 18px', background: 'none',
                                border: '1px solid var(--hm-border)', borderRadius: 20, color: 'var(--hm-text-secondary)',
                                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                              }}>{showAll ? 'Show less' : `Show all ${lesson.cards.length} words`}</button>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 10, paddingTop: 14, borderTop: '1px solid var(--hm-border)' }}>
                          <a href="/dashboard/practice" className="hm-btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            🃏 Practice Cards
                          </a>
                          <a href="/dashboard/quiz" className="hm-btn-outline" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            🎯 Quiz
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div style={{ height: 60 }} />
    </div>
  )
}
