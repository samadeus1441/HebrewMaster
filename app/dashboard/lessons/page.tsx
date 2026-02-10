'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

interface LessonData {
  id: string
  lesson_number: number
  lesson_date: string
  student_name: string
  summary: string
  topic_title?: string
  talk_ratio_student?: number
  talk_ratio_teacher?: number
  hebrew_percentage?: number
  struggles?: string[]
  strengths?: string[]
  recommendations?: string[]
  created_at: string
  cards: CardData[]
}

interface CardData {
  id: string
  front: string
  back: string
  transliteration: string
  category: string
  reps: number
  stability: number
}

export default function MyLessonsPage() {
  const [lessons, setLessons] = useState<LessonData[]>([])
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAllCards, setShowAllCards] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadLessons()
  }, [])

  async function loadLessons() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get all lessons for this user
    const { data: lessonRows, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('student_user_id', user.id)
      .order('lesson_number', { ascending: false })

    if (lessonError || !lessonRows || lessonRows.length === 0) {
      // Fallback: try to get lessons via lesson_cards junction
      const { data: cardData } = await supabase
        .from('srs_cards')
        .select('*')
        .eq('user_id', user.id)
        .eq('source', 'lesson')
        .order('created_at', { ascending: false })

      if (cardData && cardData.length > 0) {
        // Group cards by their created_at date (approximate lesson grouping)
        const grouped = groupCardsByLesson(cardData)
        setLessons(grouped)
      }
      setLoading(false)
      return
    }

    // For each lesson, get its cards via lesson_cards junction
    const enrichedLessons: LessonData[] = []
    for (const lesson of lessonRows) {
      const { data: junctionData } = await supabase
        .from('lesson_cards')
        .select('card_id')
        .eq('lesson_id', lesson.id)

      let cards: CardData[] = []
      if (junctionData && junctionData.length > 0) {
        const cardIds = junctionData.map(j => j.card_id)
        const { data: cardRows } = await supabase
          .from('srs_cards')
          .select('*')
          .in('id', cardIds)

        cards = (cardRows || []).map(c => ({
          id: c.id,
          front: c.front || '',
          back: c.back || '',
          transliteration: c.transliteration || '',
          category: c.category || 'general',
          reps: c.reps || 0,
          stability: c.stability || 0,
        }))
      }

      enrichedLessons.push({
        id: lesson.id,
        lesson_number: lesson.lesson_number || enrichedLessons.length + 1,
        lesson_date: lesson.lesson_date || lesson.created_at,
        student_name: lesson.student_name || '',
        summary: lesson.summary || '',
        topic_title: lesson.topic_title || `Lesson ${lesson.lesson_number || ''}`,
        talk_ratio_student: lesson.talk_ratio_student,
        talk_ratio_teacher: lesson.talk_ratio_teacher,
        hebrew_percentage: lesson.hebrew_percentage,
        struggles: lesson.struggles || [],
        strengths: lesson.strengths || [],
        recommendations: lesson.recommendations || [],
        created_at: lesson.created_at,
        cards,
      })
    }

    setLessons(enrichedLessons)
    setLoading(false)
  }

  // Fallback grouping when lessons table isn't populated
  function groupCardsByLesson(cards: any[]): LessonData[] {
    const groups: Record<string, any[]> = {}
    cards.forEach(card => {
      const date = new Date(card.created_at).toISOString().split('T')[0]
      if (!groups[date]) groups[date] = []
      groups[date].push(card)
    })

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, cards], index, arr) => ({
        id: `grouped-${date}`,
        lesson_number: arr.length - index,
        lesson_date: date,
        student_name: '',
        summary: '',
        topic_title: `Lesson ${arr.length - index}`,
        created_at: date,
        cards: cards.map(c => ({
          id: c.id,
          front: c.front || '',
          back: c.back || '',
          transliteration: c.transliteration || '',
          category: c.category || 'general',
          reps: c.reps || 0,
          stability: c.stability || 0,
        })),
      }))
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function getCategoryColor(cat: string): string {
    const colors: Record<string, string> = {
      family: '#E8D5B7',
      commands: '#B7D5E8',
      encouragement: '#D5E8B7',
      warnings: '#E8B7B7',
      play: '#D5B7E8',
      phrases: '#B7E8D5',
      verbs: '#E8D5D5',
      adjectives: '#D5D5E8',
      expressions: '#E8E8B7',
      greetings: '#B7E8E8',
      shopping: '#E8C5B7',
      travel: '#C5E8B7',
      'essential phrases': '#B7C5E8',
      'daily life': '#E8B7C5',
      'time expressions': '#C5B7E8',
      hobbies: '#B7E8C5',
      nouns: '#D5C5B7',
      colloquial: '#C5D5B7',
    }
    return colors[cat] || '#E5E5E0'
  }

  function getCardMastery(card: CardData): { label: string; color: string } {
    if (card.stability >= 5) return { label: 'Mastered', color: '#10B981' }
    if (card.reps >= 3) return { label: 'Reviewing', color: '#F59E0B' }
    if (card.reps >= 1) return { label: 'Seen', color: '#6B7280' }
    return { label: 'New', color: '#3B82F6' }
  }

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'he-IL'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        background: '#FAFAF8',
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: '3px solid #E5E5E0',
          borderTopColor: '#1E3A5F',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ marginTop: 16, color: '#6B7280', fontSize: 14 }}>Loading your lessons...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        padding: 32,
        textAlign: 'center',
        background: '#FAFAF8',
      }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>📚</div>
        <h1 style={{
          fontFamily: '"Fraunces", serif',
          fontSize: 32,
          color: '#1A1A2E',
          marginBottom: 12,
          fontWeight: 700,
        }}>Your lessons will appear here</h1>
        <p style={{ color: '#6B7280', fontSize: 16, maxWidth: 400, lineHeight: 1.6 }}>
          After each lesson with your teacher, personalized vocabulary and notes from YOUR lesson will show up here — not generic content, YOUR words.
        </p>
      </div>
    )
  }

  const totalWords = lessons.reduce((sum, l) => sum + l.cards.length, 0)
  const totalLessons = lessons.length

  return (
    <div style={{
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      background: '#FAFAF8',
      minHeight: '100vh',
      padding: '32px 24px',
      maxWidth: 800,
      margin: '0 auto',
    }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Frank+Ruhl+Libre:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: '"Fraunces", serif',
          fontSize: 36,
          color: '#1A1A2E',
          fontWeight: 700,
          marginBottom: 8,
        }}>
          My Lessons
        </h1>
        <p style={{ color: '#6B7280', fontSize: 15, lineHeight: 1.5 }}>
          {totalLessons} lesson{totalLessons !== 1 ? 's' : ''} completed · {totalWords} words learned
        </p>
      </div>

      {/* Lesson Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {lessons.map((lesson, idx) => {
          const isExpanded = expandedLesson === lesson.id
          const showAll = showAllCards[lesson.id]
          const visibleCards = showAll ? lesson.cards : lesson.cards.slice(0, 8)
          const categories = [...new Set(lesson.cards.map(c => c.category))].filter(Boolean)

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              <div style={{
                background: '#FFFFFF',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(26,26,46,0.06), 0 6px 16px rgba(26,26,46,0.04)',
                border: '1px solid rgba(26,26,46,0.06)',
                transition: 'box-shadow 0.2s ease',
              }}>
                {/* Lesson Header — always visible */}
                <button
                  onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                  style={{
                    display: 'flex',
                    width: '100%',
                    padding: '24px 28px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    alignItems: 'flex-start',
                    gap: 20,
                  }}
                >
                  {/* Lesson Number Badge */}
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F8A 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Fraunces", serif',
                    fontSize: 22,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {lesson.lesson_number}
                  </div>

                  {/* Lesson Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 4,
                    }}>
                      <h2 style={{
                        fontFamily: '"Fraunces", serif',
                        fontSize: 20,
                        fontWeight: 600,
                        color: '#1A1A2E',
                        margin: 0,
                      }}>
                        {lesson.topic_title || `Lesson ${lesson.lesson_number}`}
                      </h2>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: 16,
                      fontSize: 13,
                      color: '#6B7280',
                      flexWrap: 'wrap',
                      marginTop: 6,
                    }}>
                      <span>{formatDate(lesson.lesson_date)}</span>
                      <span>·</span>
                      <span>{lesson.cards.length} words</span>
                      {lesson.talk_ratio_student && (
                        <>
                          <span>·</span>
                          <span>
                            Talk: {lesson.talk_ratio_student}%
                            {lesson.talk_ratio_student >= 50 ? ' 🟢' : lesson.talk_ratio_student >= 35 ? ' 🟡' : ' 🔴'}
                          </span>
                        </>
                      )}
                      {lesson.hebrew_percentage && (
                        <>
                          <span>·</span>
                          <span>Hebrew: {lesson.hebrew_percentage}%</span>
                        </>
                      )}
                    </div>

                    {/* Category chips */}
                    {categories.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                        {categories.slice(0, 5).map(cat => (
                          <span key={cat} style={{
                            padding: '3px 10px',
                            borderRadius: 20,
                            background: getCategoryColor(cat),
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#1A1A2E',
                            textTransform: 'capitalize',
                          }}>
                            {cat}
                          </span>
                        ))}
                        {categories.length > 5 && (
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 20,
                            background: '#F0F0EC',
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#6B7280',
                          }}>
                            +{categories.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expand Arrow */}
                  <div style={{
                    fontSize: 18,
                    color: '#9CA3AF',
                    transition: 'transform 0.2s ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    flexShrink: 0,
                    marginTop: 8,
                  }}>
                    ▾
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: '0 28px 28px',
                        borderTop: '1px solid #F0F0EC',
                        paddingTop: 24,
                      }}>
                        {/* Summary */}
                        {lesson.summary && (
                          <div style={{ marginBottom: 24 }}>
                            <h3 style={{
                              fontSize: 12,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              color: '#9CA3AF',
                              marginBottom: 8,
                            }}>Summary</h3>
                            <p style={{
                              fontSize: 14,
                              color: '#374151',
                              lineHeight: 1.7,
                              margin: 0,
                            }}>{lesson.summary}</p>
                          </div>
                        )}

                        {/* Strengths & Struggles */}
                        {((lesson.strengths && lesson.strengths.length > 0) || (lesson.struggles && lesson.struggles.length > 0)) && (
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 16,
                            marginBottom: 24,
                          }}>
                            {lesson.strengths && lesson.strengths.length > 0 && (
                              <div style={{
                                background: '#F0FDF4',
                                borderRadius: 12,
                                padding: 16,
                                border: '1px solid #BBF7D0',
                              }}>
                                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  💪 Strengths
                                </h4>
                                {lesson.strengths.map((s, i) => (
                                  <p key={i} style={{ fontSize: 13, color: '#374151', margin: '4px 0', lineHeight: 1.5 }}>• {s}</p>
                                ))}
                              </div>
                            )}
                            {lesson.struggles && lesson.struggles.length > 0 && (
                              <div style={{
                                background: '#FFF7ED',
                                borderRadius: 12,
                                padding: 16,
                                border: '1px solid #FED7AA',
                              }}>
                                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#EA580C', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  🎯 Working On
                                </h4>
                                {lesson.struggles.map((s, i) => (
                                  <p key={i} style={{ fontSize: 13, color: '#374151', margin: '4px 0', lineHeight: 1.5 }}>• {s}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Vocabulary Grid */}
                        <div style={{ marginBottom: 20 }}>
                          <h3 style={{
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#9CA3AF',
                            marginBottom: 12,
                          }}>Vocabulary ({lesson.cards.length} words)</h3>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: 10,
                          }}>
                            {visibleCards.map((card) => {
                              const mastery = getCardMastery(card)
                              return (
                                <div
                                  key={card.id}
                                  onClick={() => playAudio(card.front)}
                                  style={{
                                    background: '#FAFAF8',
                                    borderRadius: 12,
                                    padding: '14px 16px',
                                    border: '1px solid #E5E5E0',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    position: 'relative',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#1E3A5F'
                                    e.currentTarget.style.background = '#FFFFFF'
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,58,95,0.08)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#E5E5E0'
                                    e.currentTarget.style.background = '#FAFAF8'
                                    e.currentTarget.style.boxShadow = 'none'
                                  }}
                                >
                                  {/* Mastery dot */}
                                  <div style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: mastery.color,
                                  }} title={mastery.label} />

                                  <div style={{
                                    fontFamily: '"Frank Ruhl Libre", serif',
                                    fontSize: 22,
                                    color: '#1A1A2E',
                                    direction: 'rtl',
                                    marginBottom: 4,
                                  }}>
                                    {card.front}
                                  </div>
                                  {card.transliteration && (
                                    <div style={{
                                      fontSize: 12,
                                      color: '#9CA3AF',
                                      fontStyle: 'italic',
                                      marginBottom: 4,
                                    }}>
                                      {card.transliteration}
                                    </div>
                                  )}
                                  <div style={{
                                    fontSize: 13,
                                    color: '#6B7280',
                                    fontWeight: 500,
                                  }}>
                                    {card.back}
                                  </div>
                                  <div style={{
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 12,
                                    fontSize: 14,
                                    opacity: 0.3,
                                  }}>🔊</div>
                                </div>
                              )
                            })}
                          </div>

                          {/* Show more/less */}
                          {lesson.cards.length > 8 && (
                            <button
                              onClick={() => setShowAllCards(prev => ({
                                ...prev,
                                [lesson.id]: !prev[lesson.id]
                              }))}
                              style={{
                                display: 'block',
                                margin: '16px auto 0',
                                padding: '8px 20px',
                                background: 'none',
                                border: '1px solid #E5E5E0',
                                borderRadius: 20,
                                color: '#6B7280',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#1E3A5F'
                                e.currentTarget.style.color = '#1E3A5F'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E5E5E0'
                                e.currentTarget.style.color = '#6B7280'
                              }}
                            >
                              {showAll ? 'Show less' : `Show all ${lesson.cards.length} words`}
                            </button>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: 12,
                          paddingTop: 16,
                          borderTop: '1px solid #F0F0EC',
                        }}>
                          <a
                            href="/dashboard/practice"
                            style={{
                              flex: 1,
                              padding: '12px 20px',
                              background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F8A 100%)',
                              color: '#FFFFFF',
                              borderRadius: 12,
                              fontSize: 14,
                              fontWeight: 700,
                              textAlign: 'center',
                              textDecoration: 'none',
                              transition: 'opacity 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            🃏 Practice These Cards
                          </a>
                          <a
                            href="/dashboard/quiz"
                            style={{
                              flex: 1,
                              padding: '12px 20px',
                              background: '#FFFFFF',
                              color: '#1E3A5F',
                              borderRadius: 12,
                              fontSize: 14,
                              fontWeight: 700,
                              textAlign: 'center',
                              textDecoration: 'none',
                              border: '2px solid #1E3A5F',
                              transition: 'all 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#1E3A5F'
                              e.currentTarget.style.color = '#FFFFFF'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#FFFFFF'
                              e.currentTarget.style.color = '#1E3A5F'
                            }}
                          >
                            🎯 Quiz This Lesson
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

      {/* Bottom spacer */}
      <div style={{ height: 60 }} />
    </div>
  )
}
