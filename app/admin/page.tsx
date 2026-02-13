'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// ═══════════════════════════════════════════════════════════════
// HEBREW MASTER — LESSON CONTROL PANEL v2
// Built for reviewing nikud, catching errors before import.
// Works for Hebrew AND Yiddish lessons.
// ═══════════════════════════════════════════════════════════════

interface Student {
  id: string; user_id: string; student_name: string;
  native_language: string; current_level: string;
}

interface VocabularyItem {
  front: string; back: string; transliteration: string; category: string;
}

interface DialogueTurn {
  speaker: string; text_he: string; text_en: string;
  type?: string; options?: any[];
}

interface ConversationPractice {
  title: string; context: string; dialogue: DialogueTurn[];
}

interface LessonData {
  lesson_number: number | string;
  lesson_date: string;
  topic_title: string;
  summary: string;
  vocabulary: VocabularyItem[];
  conversation_practice?: ConversationPractice;
  analysis: any;
}

interface ImportResult {
  success: boolean; lesson_id: string; cards_created: number; message: string;
}

const CATEGORIES = [
  'greetings','phrases','shopping','travel','family','commands','encouragement',
  'warnings','play','verbs','adjectives','expressions','nouns','daily life',
  'colloquial','hobbies','time expressions','food','numbers','emotions'
]

const EMPTY_VOCAB: VocabularyItem = { front: '', back: '', transliteration: '', category: 'phrases' }

const EXAMPLE_JSON = `{
  "lesson_number": 1,
  "lesson_date": "${new Date().toISOString().split('T')[0]}",
  "topic_title": "Basic Greetings & Introduction",
  "summary": "Trial lesson. Covered basic greetings and self-introduction...",
  "vocabulary": [
    {"front": "שָׁלוֹם", "back": "Hello / Peace", "transliteration": "shalom", "category": "greetings"},
    {"front": "מַה שְׁלוֹמְךָ", "back": "How are you? (m)", "transliteration": "ma shlomkha", "category": "phrases"}
  ],
  "conversation_practice": {
    "title": "Meeting on the Street",
    "context": "You bump into a friend near the shuk",
    "dialogue": [
      {"speaker": "Friend", "text_he": "הֵי, מַה נִשְׁמָע?", "text_en": "Hey, how are things?", "type": "statement"},
      {"speaker": "Student", "text_he": "בְּסֵדֶר גָּמוּר, מַה אִתְּךָ?", "text_en": "Totally fine, what about you?", "type": "statement"}
    ]
  },
  "analysis": {
    "strengths": ["Good ear for vowels", "Quick recall"],
    "struggles": ["Gender agreement", "Pronunciation of ח"],
    "recommendations": ["Drill greeting responses", "Practice ח vs כ minimal pairs"],
    "talk_ratio": {"student": 35, "teacher": 65},
    "hebrew_percentage": 20,
    "notes": "Motivated student, learns through conversation"
  }
}`

export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'import' | 'register' | 'history'>('import')

  // Register
  const [newStudentEmail, setNewStudentEmail] = useState('')
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentLang, setNewStudentLang] = useState('en')
  const [newStudentGoals, setNewStudentGoals] = useState('')
  const [registerResult, setRegisterResult] = useState<string | null>(null)

  // History
  const [lessons, setLessons] = useState<any[]>([])

  // Review
  const [isReviewing, setIsReviewing] = useState(false)
  const [parsedData, setParsedData] = useState<LessonData | null>(null)
  const [editingVocab, setEditingVocab] = useState<number | null>(null)
  const [editingDialogue, setEditingDialogue] = useState<number | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => { loadStudents() }, [])

  async function loadStudents() {
    const res = await fetch('/api/import-lesson')
    const data = await res.json()
    if (data.students) setStudents(data.students)
  }

  async function loadHistory(studentName: string) {
    const { data } = await supabase.from('lessons')
      .select('id, student_name, lesson_number, lesson_date, topic_title, summary, vocabulary, analysis, created_at')
      .eq('student_name', studentName).order('lesson_number', { ascending: false })
    setLessons(data || [])
  }

  // === PARSE & REVIEW ===
  const handleParseAndReview = () => {
    setError(null); setResult(null)
    if (!selectedStudent) { setError('Select a student first'); return }
    try {
      const parsed = JSON.parse(jsonInput)
      if (!parsed.vocabulary && !parsed.conversation_practice) {
        throw new Error("JSON needs at least 'vocabulary' or 'conversation_practice'")
      }
      const safeData: LessonData = {
        lesson_number: parsed.lesson_number || 1,
        lesson_date: parsed.lesson_date || new Date().toISOString().split('T')[0],
        topic_title: parsed.topic_title || '',
        summary: parsed.summary || '',
        vocabulary: parsed.vocabulary || [],
        conversation_practice: parsed.conversation_practice,
        analysis: parsed.analysis || {}
      }
      setParsedData(safeData)
      setIsReviewing(true)
      setEditingVocab(null)
      setEditingDialogue(null)
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message)
    }
  }

  // === VOCAB EDITING ===
  const updateVocab = (idx: number, field: keyof VocabularyItem, value: string) => {
    if (!parsedData) return
    const v = [...parsedData.vocabulary]
    v[idx] = { ...v[idx], [field]: value }
    setParsedData({ ...parsedData, vocabulary: v })
  }
  const addVocab = () => {
    if (!parsedData) return
    setParsedData({ ...parsedData, vocabulary: [...parsedData.vocabulary, { ...EMPTY_VOCAB }] })
    setEditingVocab(parsedData.vocabulary.length)
  }
  const deleteVocab = (idx: number) => {
    if (!parsedData) return
    const v = parsedData.vocabulary.filter((_, i) => i !== idx)
    setParsedData({ ...parsedData, vocabulary: v })
    setEditingVocab(null)
  }

  // === DIALOGUE EDITING ===
  const updateDialogue = (idx: number, field: keyof DialogueTurn, value: string) => {
    if (!parsedData?.conversation_practice) return
    const d = [...parsedData.conversation_practice.dialogue]
    d[idx] = { ...d[idx], [field]: value }
    setParsedData({ ...parsedData, conversation_practice: { ...parsedData.conversation_practice, dialogue: d } })
  }
  const addDialogueTurn = () => {
    if (!parsedData?.conversation_practice) return
    const d = [...parsedData.conversation_practice.dialogue, { speaker: 'Student', text_he: '', text_en: '', type: 'statement' }]
    setParsedData({ ...parsedData, conversation_practice: { ...parsedData.conversation_practice, dialogue: d } })
    setEditingDialogue(d.length - 1)
  }
  const deleteDialogueTurn = (idx: number) => {
    if (!parsedData?.conversation_practice) return
    const d = parsedData.conversation_practice.dialogue.filter((_, i) => i !== idx)
    setParsedData({ ...parsedData, conversation_practice: { ...parsedData.conversation_practice, dialogue: d } })
    setEditingDialogue(null)
  }

  // === ANALYSIS EDITING ===
  const updateAnalysisArray = (field: string, idx: number, value: string) => {
    if (!parsedData) return
    const arr = [...(parsedData.analysis[field] || [])]
    arr[idx] = value
    setParsedData({ ...parsedData, analysis: { ...parsedData.analysis, [field]: arr } })
  }
  const addAnalysisItem = (field: string) => {
    if (!parsedData) return
    const arr = [...(parsedData.analysis[field] || []), '']
    setParsedData({ ...parsedData, analysis: { ...parsedData.analysis, [field]: arr } })
  }
  const deleteAnalysisItem = (field: string, idx: number) => {
    if (!parsedData) return
    const arr = (parsedData.analysis[field] || []).filter((_: any, i: number) => i !== idx)
    setParsedData({ ...parsedData, analysis: { ...parsedData.analysis, [field]: arr } })
  }

  // === IMPORT ===
  async function handleFinalImport() {
    if (!selectedStudent || !parsedData) return
    const student = students.find(s => s.user_id === selectedStudent)
    if (!student) { setError('Student not found'); return }
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/import-lesson', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_user_id: student.user_id, student_name: student.student_name,
          lesson_number: Number(parsedData.lesson_number), lesson_date: parsedData.lesson_date,
          topic_title: parsedData.topic_title, summary: parsedData.summary,
          vocabulary: parsedData.vocabulary, conversation_practice: parsedData.conversation_practice,
          analysis: parsedData.analysis
        })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data); setJsonInput(''); setIsReviewing(false); setParsedData(null)
        loadHistory(student.student_name)
      } else { setError(data.error || 'Import failed') }
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  // === REGISTER ===
  async function handleRegister() {
    setRegisterResult(null); setError(null)
    if (!newStudentEmail || !newStudentName) { setError('Name and email required'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/register-student', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newStudentEmail, student_name: newStudentName, native_language: newStudentLang, learning_goals: newStudentGoals })
      })
      const data = await res.json()
      if (data.success) {
        setRegisterResult(`✅ ${newStudentName} registered!${data.temp_password ? ` Temp: ${data.temp_password}` : ''}`)
        setNewStudentEmail(''); setNewStudentName(''); setNewStudentGoals(''); loadStudents()
      } else { setError(data.error || 'Failed') }
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  // ═══════════════════ STYLES ═══════════════════
  const S = {
    page: { minHeight: '100vh', background: '#FAFAF8', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: '#1A1A2E' } as const,
    header: { borderBottom: '2px solid #E5E5E0', padding: '20px 32px', background: 'white' } as const,
    tabs: { display: 'flex' as const, gap: 0, borderBottom: '2px solid #E5E5E0', padding: '0 32px', background: 'white' },
    tab: (active: boolean) => ({
      padding: '14px 24px', background: 'none', border: 'none',
      borderBottom: active ? '3px solid #1E3A5F' : '3px solid transparent',
      color: active ? '#1E3A5F' : '#9CA3AF', cursor: 'pointer',
      fontSize: 14, fontWeight: 700, letterSpacing: '0.3px',
    }),
    content: { maxWidth: 1000, margin: '0 auto', padding: 32 } as const,
    input: { width: '100%', padding: '12px 16px', background: 'white', border: '2px solid #E5E5E0', borderRadius: 10, color: '#1A1A2E', fontSize: 15, outline: 'none', boxSizing: 'border-box' as const },
    label: { display: 'block' as const, fontSize: 12, fontWeight: 700, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
    btn: (disabled?: boolean) => ({
      width: '100%', padding: 16, background: disabled ? '#E5E5E0' : 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
      border: 'none', borderRadius: 12, color: disabled ? '#9CA3AF' : 'white',
      fontSize: 16, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 4px 12px rgba(30,58,95,0.2)',
    }),
    card: { background: 'white', border: '1px solid #E5E5E0', borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: '0 1px 3px rgba(26,26,46,0.04)' } as const,
    hebrewLarge: { fontFamily: '"Frank Ruhl Libre", serif', fontSize: 36, fontWeight: 700, direction: 'rtl' as const, lineHeight: 1.4, color: '#1A1A2E' },
    hebrewMed: { fontFamily: '"Frank Ruhl Libre", serif', fontSize: 22, fontWeight: 600, direction: 'rtl' as const, lineHeight: 1.4, color: '#1A1A2E' },
    badge: (color: string) => ({
      display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: color === 'blue' ? '#E8EEF4' : color === 'green' ? '#D1FAE5' : color === 'orange' ? '#FFF7ED' : '#F5F5F3',
      color: color === 'blue' ? '#1E3A5F' : color === 'green' ? '#065F46' : color === 'orange' ? '#9A3412' : '#6B7280',
    }),
    miniBtn: (color: string) => ({
      padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
      background: color === 'red' ? '#FEE2E2' : color === 'blue' ? '#E8EEF4' : '#F5F5F3',
      color: color === 'red' ? '#991B1B' : color === 'blue' ? '#1E3A5F' : '#6B7280',
    }),
  }

  // ═══════════════════ RENDER ═══════════════════
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 24, fontWeight: 700, color: '#1E3A5F', margin: 0 }}>
          🎛️ Lesson Control Panel
        </h1>
        <p style={{ fontSize: 13, color: '#9CA3AF', margin: '4px 0 0' }}>
          Import → Review nikud → Confirm → Student gets flashcards + scenarios ({students.length} students)
        </p>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {(['import', 'register', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setIsReviewing(false) }} style={S.tab(activeTab === tab)}>
            {tab === 'import' ? '📥 Import' : tab === 'register' ? '👤 Add Student' : '📋 History'}
          </button>
        ))}
      </div>

      <div style={S.content}>
        {/* Messages */}
        {error && (
          <div style={{ background: '#FFF7ED', border: '1px solid #FDBA74', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#9A3412', fontSize: 14, fontWeight: 600 }}>
            ❌ {error}
          </div>
        )}
        {result && (
          <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#065F46', fontSize: 14, fontWeight: 600 }}>
            ✅ {result.message}
          </div>
        )}

        {/* ═══════════════ IMPORT TAB ═══════════════ */}
        {activeTab === 'import' && (
          <div>
            {/* PASTE VIEW */}
            {!isReviewing && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label style={S.label}>Student</label>
                  <select value={selectedStudent} onChange={e => {
                    setSelectedStudent(e.target.value)
                    const s = students.find(s => s.user_id === e.target.value)
                    if (s) loadHistory(s.student_name)
                  }} style={S.input}>
                    <option value="">-- Choose student --</option>
                    {students.map(s => <option key={s.user_id} value={s.user_id}>{s.student_name} ({s.native_language})</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={S.label}>Paste Lesson JSON from Claude</label>
                    <button onClick={() => setJsonInput(EXAMPLE_JSON)} style={{ ...S.miniBtn('blue') }}>Load Example</button>
                  </div>
                  <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)}
                    placeholder='Paste JSON from Claude or ChatGPT...'
                    rows={14} style={{ ...S.input, fontFamily: "'Courier New', monospace", fontSize: 12, lineHeight: 1.6, resize: 'vertical' as const }} />
                </div>

                <button onClick={handleParseAndReview} disabled={!selectedStudent || !jsonInput} style={S.btn(!selectedStudent || !jsonInput)}>
                  🔍 Parse & Review Hebrew
                </button>
              </>
            )}

            {/* ═══════════════ REVIEW VIEW ═══════════════ */}
            {isReviewing && parsedData && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
                      Review Lesson
                    </h2>
                    <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
                      Check every Hebrew word below. Nikud errors here = nikud errors on flashcards.
                    </p>
                  </div>
                  <button onClick={() => setIsReviewing(false)} style={{ ...S.miniBtn('red'), padding: '8px 16px', fontSize: 13 }}>
                    ← Back
                  </button>
                </div>

                {/* Lesson Details Edit */}
                <div style={S.card}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={S.label}>Topic Title</label>
                      <input value={parsedData.topic_title} onChange={e => setParsedData({ ...parsedData, topic_title: e.target.value })} style={S.input} />
                    </div>
                    <div>
                      <label style={S.label}>Lesson Date</label>
                      <input type="date" value={parsedData.lesson_date} onChange={e => setParsedData({ ...parsedData, lesson_date: e.target.value })} style={S.input} />
                    </div>
                  </div>
                </div>

                {/* Vocabulary Review */}
                <div style={S.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>📚 Vocabulary</h3>
                    <button onClick={addVocab} style={S.miniBtn('blue')}>+ Add Row</button>
                  </div>
                  {parsedData.vocabulary.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: 10, marginBottom: 10 }}>
                      <input value={item.front} dir="rtl" onChange={e => updateVocab(idx, 'front', e.target.value)} placeholder="Hebrew" style={{ ...S.input, fontSize: 18 }} />
                      <input value={item.transliteration} onChange={e => updateVocab(idx, 'transliteration', e.target.value)} placeholder="Translit" style={S.input} />
                      <input value={item.back} onChange={e => updateVocab(idx, 'back', e.target.value)} placeholder="English" style={S.input} />
                      <select value={item.category} onChange={e => updateVocab(idx, 'category', e.target.value)} style={S.input}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button onClick={() => deleteVocab(idx)} style={S.miniBtn('red')}>✕</button>
                    </div>
                  ))}
                </div>

                <button onClick={handleFinalImport} disabled={loading} style={S.btn(loading)}>
                  {loading ? '⏳ Importing...' : '🚀 Looks Good, Import Now'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ REGISTER TAB ═══════════════ */}
        {activeTab === 'register' && (
          <div style={S.card}>
            <h3>Register New Student</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Name" style={S.input} />
              <input value={newStudentEmail} onChange={e => setNewStudentEmail(e.target.value)} placeholder="Email" style={S.input} />
              <button onClick={handleRegister} disabled={loading} style={S.btn(loading)}>Add Student</button>
            </div>
          </div>
        )}

        {/* ═══════════════ HISTORY TAB ═══════════════ */}
        {activeTab === 'history' && (
          <div>
            <select value={selectedStudent} onChange={e => {
              setSelectedStudent(e.target.value)
              const s = students.find(s => s.user_id === e.target.value)
              if (s) loadHistory(s.student_name)
            }} style={{ ...S.input, marginBottom: 20 }}>
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s.user_id} value={s.user_id}>{s.student_name}</option>)}
            </select>
            {lessons.map(lesson => (
              <div key={lesson.id} style={S.card}>
                <div style={{ fontWeight: 700 }}>Lesson {lesson.lesson_number} - {lesson.lesson_date}</div>
                <div>{lesson.topic_title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}