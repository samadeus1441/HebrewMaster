'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// --- 1. TYPES ---
interface Student {
  id: string
  user_id: string
  student_name: string
  native_language: string
  current_level: string
}

interface VocabularyItem {
  front: string
  back: string
  transliteration: string
  category: string
}

interface DialogueTurn {
  speaker: string
  text_he: string
  text_en: string
  type?: string
  options?: any[]
}

interface ConversationPractice {
  title: string
  context: string
  dialogue: DialogueTurn[]
}

interface LessonData {
  lesson_number: number
  lesson_date: string
  summary: string
  vocabulary: VocabularyItem[]
  conversation_practice?: ConversationPractice
  analysis: any
}

interface ImportResult {
  success: boolean
  lesson_id: string
  cards_created: number
  message: string
}

// --- 2. EXAMPLE JSON ---
const EXAMPLE_JSON = `{
  "lesson_number": 1,
  "lesson_date": "${new Date().toISOString().split('T')[0]}",
  "summary": "Trial lesson. Covered basic greetings and self-introduction...",
  "vocabulary": [
    {"front": "שָׁלוֹם", "back": "Hello / Peace", "transliteration": "shalom", "category": "greetings"},
    {"front": "מַה שְׁלוֹמְךָ", "back": "How are you? (m)", "transliteration": "ma shlomkha", "category": "phrases"}
  ],
  "conversation_practice": {
    "title": "Basic Greeting",
    "context": "Meeting a friend on the street",
    "dialogue": [
      {
        "speaker": "Teacher",
        "text_he": "בּוֹקֶר טוֹב דָּנִי!",
        "text_en": "Good morning Dani!",
        "type": "statement"
      },
      {
        "speaker": "Student",
        "text_he": "בּוֹקֶר אוֹר, מַה נִּשְׁמָע?",
        "text_en": "Morning light (response), how are things?",
        "type": "statement"
      }
    ]
  },
  "analysis": {
    "struggles": ["Gender agreement", "Pronunciation of ח"],
    "strengths": ["Good ear for vowels", "Quick recall"],
    "recommendations": ["Drill greeting responses", "Practice ח vs כ minimal pairs"],
    "talk_ratio": {"student": 35, "teacher": 65},
    "hebrew_percentage": 20,
    "notes": "Motivated student, learns through conversation"
  }
}`

export default function AdminPage() {
  // --- STATE ---
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'import' | 'register' | 'history'>('import')
  
  // Register State
  const [newStudentEmail, setNewStudentEmail] = useState('')
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentLang, setNewStudentLang] = useState('en')
  const [newStudentGoals, setNewStudentGoals] = useState('')
  const [registerResult, setRegisterResult] = useState<string | null>(null)

  // History State
  const [lessons, setLessons] = useState<any[]>([])

  // --- NEW: HIDL Review State ---
  const [isReviewing, setIsReviewing] = useState(false)
  const [parsedData, setParsedData] = useState<LessonData | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // --- EFFECTS ---
  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    const res = await fetch('/api/import-lesson')
    const data = await res.json()
    if (data.students) {
      setStudents(data.students)
    }
  }

  async function loadHistory(studentName: string) {
    const { data } = await supabase
      .from('lessons')
      .select('id, student_name, lesson_number, lesson_date, summary, vocabulary, analysis, created_at')
      .eq('student_name', studentName)
      .order('lesson_number', { ascending: false })
    
    setLessons(data || [])
  }

  // --- HANDLERS ---

  // Phase 1: Parse & Review
  const handleParseAndReview = () => {
    setError(null)
    setResult(null)

    if (!selectedStudent) {
      setError('Select a student first')
      return
    }

    try {
      // 1. Try to parse JSON
      const parsed = JSON.parse(jsonInput)
      
      // 2. Minimal validation (soft)
      if (!parsed.vocabulary && !parsed.conversation_practice) {
        throw new Error("JSON must contain at least 'vocabulary' or 'conversation_practice'")
      }

      setParsedData(parsed)
      setIsReviewing(true) // Switch UI to review mode

    } catch (e: any) {
      setError('Invalid JSON. Please check the output from Claude. Error: ' + e.message)
    }
  }

  // Edit Helpers
  const updateVocab = (index: number, field: keyof VocabularyItem, value: string) => {
    if (!parsedData) return
    const newVocab = [...parsedData.vocabulary]
    newVocab[index] = { ...newVocab[index], [field]: value }
    setParsedData({ ...parsedData, vocabulary: newVocab })
  }

  const updateDialogue = (index: number, field: keyof DialogueTurn, value: string) => {
    if (!parsedData || !parsedData.conversation_practice) return
    const newDialogue = [...parsedData.conversation_practice.dialogue]
    newDialogue[index] = { ...newDialogue[index], [field]: value }
    setParsedData({
      ...parsedData,
      conversation_practice: {
        ...parsedData.conversation_practice,
        dialogue: newDialogue
      }
    })
  }

  // Phase 2: Final Import
  async function handleFinalImport() {
    if (!selectedStudent || !parsedData) return
    
    const student = students.find(s => s.user_id === selectedStudent)
    if (!student) {
      setError('Student not found')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/import-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_user_id: student.user_id,
          student_name: student.student_name,
          // Use the edited data from state
          lesson_number: parsedData.lesson_number,
          lesson_date: parsedData.lesson_date,
          summary: parsedData.summary,
          vocabulary: parsedData.vocabulary || [],
          conversation_practice: parsedData.conversation_practice,
          analysis: parsedData.analysis || {}
        })
      })

      const data = await res.json()

      if (data.success) {
        setResult(data)
        // Reset everything
        setJsonInput('')
        setIsReviewing(false)
        setParsedData(null)
        loadHistory(student.student_name)
      } else {
        setError(data.error || 'Import failed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Register Handler
  async function handleRegister() {
    setRegisterResult(null)
    setError(null)

    if (!newStudentEmail || !newStudentName) {
      setError('Name and email are required')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newStudentEmail,
          student_name: newStudentName,
          native_language: newStudentLang,
          learning_goals: newStudentGoals
        })
      })

      const data = await res.json()
      
      if (data.success) {
        setRegisterResult(`✅ ${newStudentName} registered!${data.temp_password ? ` Temp password: ${data.temp_password}` : ' They can now sign up.'}`)
        setNewStudentEmail('')
        setNewStudentName('')
        setNewStudentGoals('')
        loadStudents()
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- RENDER ---
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      color: '#1f2937',
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '2px solid #e5e7eb',
        padding: '20px 32px',
        backgroundColor: '#f9fafb'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
          🎛️ Lesson Control Panel
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
          Import lesson data → Student gets personalized flashcards ({students.length} students)
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0',
        borderBottom: '2px solid #e5e7eb',
        padding: '0 32px',
        backgroundColor: '#ffffff'
      }}>
        {(['import', 'register', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setIsReviewing(false); }}
            style={{
              padding: '14px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid #10b981' : '3px solid transparent',
              color: activeTab === tab ? '#10b981' : '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {tab === 'import' ? '📥 Import' : tab === 'register' ? '👤 Add Student' : '📋 History'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px' }}>

        {/* Messages */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#991b1b'
          }}>
            ❌ {error}
          </div>
        )}

        {result && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#166534'
          }}>
            ✅ {result.message}
          </div>
        )}

        {/* IMPORT TAB */}
        {activeTab === 'import' && (
          <div>
            {/* View 1: Paste JSON (When NOT reviewing) */}
            {!isReviewing && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    color: '#374151',
                    marginBottom: '8px' 
                  }}>
                    Select Student
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => {
                      setSelectedStudent(e.target.value)
                      const s = students.find(s => s.user_id === e.target.value)
                      if (s) loadHistory(s.student_name)
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#ffffff',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      color: '#111827',
                      fontSize: '15px'
                    }}
                  >
                    <option value="">-- Choose student --</option>
                    {students.map(s => (
                      <option key={s.user_id} value={s.user_id}>
                        {s.student_name} ({s.native_language})
                      </option>
                    ))}
                  </select>
                  
                  {students.length === 0 && (
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>
                      No students yet. Go to "Add Student" tab first.
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                      Paste Lesson JSON
                    </label>
                    <button
                      onClick={() => setJsonInput(EXAMPLE_JSON)}
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        color: '#374151',
                        padding: '4px 12px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Load Example
                    </button>
                  </div>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='Paste JSON from Claude...'
                    rows={14}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: '#f9fafb',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      color: '#111827',
                      fontSize: '13px',
                      fontFamily: "'Courier New', monospace",
                      lineHeight: '1.5',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  onClick={handleParseAndReview}
                  disabled={!selectedStudent || !jsonInput}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: (!selectedStudent || !jsonInput) ? '#e5e7eb' : '#10b981',
                    border: 'none',
                    borderRadius: '8px',
                    color: (!selectedStudent || !jsonInput) ? '#9ca3af' : '#ffffff',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: (!selectedStudent || !jsonInput) ? 'not-allowed' : 'pointer'
                  }}
                >
                  🔍 Review & Validate
                </button>
              </>
            )}

            {/* View 2: Review Mode (HIDL) */}
            {isReviewing && parsedData && (
              <div style={{ 
                border: '2px solid #3b82f6', 
                borderRadius: '12px', 
                padding: '24px', 
                background: '#ffffff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    Reviewing Lesson {parsedData.lesson_number}
                  </h2>
                  <button 
                    onClick={() => setIsReviewing(false)}
                    style={{ 
                      color: '#ef4444', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>

                {/* Section: Vocabulary */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#4b5563', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📚 Vocabulary 
                    <span style={{ fontSize: '12px', background: '#e5e7eb', padding: '2px 8px', borderRadius: '12px' }}>
                      {parsedData.vocabulary.length} words
                    </span>
                  </h3>
                  
                  <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                          <th style={{ padding: '12px', textAlign: 'left', width: '25%' }}>Hebrew</th>
                          <th style={{ padding: '12px', textAlign: 'left', width: '25%' }}>Transliteration</th>
                          <th style={{ padding: '12px', textAlign: 'left', width: '25%' }}>English</th>
                          <th style={{ padding: '12px', textAlign: 'left', width: '25%' }}>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.vocabulary.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '8px' }}>
                              <input 
                                value={item.front} 
                                onChange={(e) => updateVocab(idx, 'front', e.target.value)}
                                dir="rtl"
                                style={{ width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', textAlign: 'right', fontWeight: 'bold' }} 
                              />
                            </td>
                            <td style={{ padding: '8px' }}>
                              <input 
                                value={item.transliteration} 
                                onChange={(e) => updateVocab(idx, 'transliteration', e.target.value)}
                                style={{ width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', fontFamily: 'monospace', color: '#2563eb' }} 
                              />
                            </td>
                            <td style={{ padding: '8px' }}>
                              <input 
                                value={item.back} 
                                onChange={(e) => updateVocab(idx, 'back', e.target.value)}
                                style={{ width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px' }} 
                              />
                            </td>
                            <td style={{ padding: '8px' }}>
                              <input 
                                value={item.category} 
                                onChange={(e) => updateVocab(idx, 'category', e.target.value)}
                                style={{ width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '12px', background: '#f9fafb' }} 
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section: Scenario */}
                {parsedData.conversation_practice && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#4b5563', marginBottom: '12px' }}>
                      💬 Scenario: {parsedData.conversation_practice.title}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      {parsedData.conversation_practice.dialogue.map((turn, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ width: '100px', flexShrink: 0 }}>
                            <input 
                              value={turn.speaker}
                              onChange={(e) => updateDialogue(idx, 'speaker', e.target.value)}
                              style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', background: '#fff' }}
                            />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input 
                              value={turn.text_he}
                              onChange={(e) => updateDialogue(idx, 'text_he', e.target.value)}
                              dir="rtl"
                              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', background: '#fff' }}
                            />
                            <input 
                              value={turn.text_en}
                              onChange={(e) => updateDialogue(idx, 'text_en', e.target.value)}
                              style={{ width: '100%', padding: '6px', border: 'none', background: 'transparent', fontSize: '13px', color: '#64