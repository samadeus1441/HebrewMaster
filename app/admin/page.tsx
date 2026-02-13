'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// --- 1. TYPES (Updated for Review) ---
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
  "summary": "Trial lesson. Covered basic greetings...",
  "vocabulary": [
    {"front": "שָׁלוֹם", "back": "Hello", "transliteration": "shalom", "category": "greetings"}
  ],
  "conversation_practice": {
    "title": "Ordering Coffee",
    "context": "At Aroma",
    "dialogue": [
      {"speaker": "Teacher", "text_he": "מַה בִּשְׁבִילְךָ?", "text_en": "What for you?", "type": "statement"}
    ]
  },
  "analysis": {
    "struggles": [], "strengths": [], "recommendations": [], "talk_ratio": {"student": 35, "teacher": 65}, "hebrew_percentage": 20, "notes": ""
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

  // --- NEW: Review State (HIDL) ---
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

  // Step 1: Parse JSON and open Review Mode
  const handleParseAndReview = () => {
    setError(null)
    setResult(null)

    if (!selectedStudent) {
      setError('Select a student first')
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      // Basic validation
      if (!parsed.lesson_number) throw new Error("Missing 'lesson_number'")
      
      setParsedData(parsed)
      setIsReviewing(true) // Switch to review UI
    } catch (e: any) {
      setError('Invalid JSON. Copy the exact output from Claude. ' + e.message)
    }
  }

  // Edit Helper: Update Vocabulary
  const updateVocab = (index: number, field: keyof VocabularyItem, value: string) => {
    if (!parsedData) return
    const newVocab = [...parsedData.vocabulary]
    newVocab[index] = { ...newVocab[index], [field]: value }
    setParsedData({ ...parsedData, vocabulary: newVocab })
  }

  // Edit Helper: Update Dialogue
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

  // Step 2: Final Import (Sends the EDITED data)
  async function handleFinalImport() {
    if (!selectedStudent || !parsedData) return

    const student = students.find(s => s.user_id === selectedStudent)
    if (!student) {
      setError('Student not found')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/import-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_user_id: student.user_id,
          student_name: student.student_name,
          // Use the parsedData (which might have been edited by you)
          lesson_number: parsedData.lesson_number,
          lesson_date: parsedData.lesson_date,
          summary: parsedData.summary,
          vocabulary: parsedData.vocabulary || [],
          conversation_practice: parsedData.conversation_practice, // Added support for scenarios
          analysis: parsedData.analysis || {}
        })
      })

      const data = await res.json()

      if (data.success) {
        setResult(data)
        setJsonInput('')
        setIsReviewing(false) // Close review mode
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

  // Register Logic (Unchanged)
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
            onClick={() => setActiveTab(tab)}
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
            {/* --- PHASE 1: Paste JSON (Only show if NOT reviewing) --- */}
            {!isReviewing && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
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
                    background: (!selectedStudent || !jsonInput) ? '#e5e7eb' : '#3b82f6',
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

            {/* --- PHASE 2: Review & Edit (Only show if reviewing) --- */}
            {isReviewing && parsedData && (
              <div style={{ 
                animation: 'fadeIn 0.3s',
                border: '2px solid #3b82f6', 
                borderRadius: '12px', 
                padding: '24px',
                background: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    Reviewing: Lesson {parsedData.lesson_number}
                  </h2>
                  <button 
                    onClick={() => setIsReviewing(false)}
                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Cancel
                  </button>
                </div>

                {/* Vocabulary Editor */}
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#4b5563' }}>
                  📚 Vocabulary ({parsedData.vocabulary.length})
                </h3>
                <div style={{ overflowX: 'auto', marginBottom: '24px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <tr>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Hebrew</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>English</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Translit</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Cat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.vocabulary.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '5px' }}>
                            <input 
                              value={item.front} 
                              onChange={(e) => updateVocab(idx, 'front', e.target.value)}
                              dir="rtl"
                              style={{ width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px' }} 
                            />
                          </td>
                          <td style={{ padding: '5px' }}>
                             <input 
                              value={item.back} 
                              onChange={(e) => updateVocab(idx, 'back', e.target.value)}
                              style={{ width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px' }} 
                            />
                          </td>
                          <td style={{ padding: '5px' }}>
                             <input 
                              value={item.transliteration} 
                              onChange={(e) => updateVocab(idx, 'transliteration', e.target.value)}
                              style={{ width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#2563eb' }} 
                            />
                          </td>
                           <td style={{ padding: '5px' }}>
                             <input 
                              value={item.category} 
                              onChange={(e) => updateVocab(idx, 'category', e.target.value)}
                              style={{ width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '12px' }} 
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Scenario Editor (If exists) */}
                {parsedData.conversation_practice && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#4b5563' }}>
                      💬 Scenario: {parsedData.conversation_practice.title}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {parsedData.conversation_practice.dialogue.map((turn, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px', padding: '10px', background: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                           <div style={{ width: '80px' }}>
                              <input 
                                value={turn.speaker}
                                onChange={(e) => updateDialogue(idx, 'speaker', e.target.value)}
                                style={{ width: '100%', fontWeight: 'bold', fontSize: '12px', padding: '4px', textAlign: 'center' }}
                              />
                           </div>
                           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                             <input 
                                value={turn.text_he}
                                onChange={(e) => updateDialogue(idx, 'text_he', e.target.value)}
                                dir="rtl"
                                style={{ width: '100%', fontWeight: 'bold', padding: '5px' }}
                              />
                              <input 
                                value={turn.text_en}
                                onChange={(e) => updateDialogue(idx, 'text_en', e.target.value)}
                                style={{ width: '100%', fontSize: '13px', color: '#6b7280', padding: '5px' }}
                              />
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ marginTop: '20px' }}>
                  <button
                    onClick={handleFinalImport}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: '#10b981',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: 700,
                      cursor: loading ? 'wait' : 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {loading ? '⏳ Importing...' : '🚀 Confirm & Import Lesson'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REGISTER TAB */}
        {activeTab === 'register' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Student Name
                </label>
                <input
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Nikolai"
                  style={{
                    width: '100%', padding: '12px 16px', background: '#ffffff',
                    border: '2px solid #d1d5db', borderRadius: '8px', color: '#111827',
                    fontSize: '15px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="nikolai@example.com"
                  type="email"
                  style={{
                    width: '100%', padding: '12px 16px', background: '#ffffff',
                    border: '2px solid #d1d5db', borderRadius: '8px', color: '#111827',
                    fontSize: '15px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Language
                  </label>
                  <select
                    value={newStudentLang}
                    onChange={(e) => setNewStudentLang(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 16px', background: '#ffffff',
                      border: '2px solid #d1d5db', borderRadius: '8px', color: '#111827',
                      fontSize: '15px'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="ru">Russian</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Learning Goals
                  </label>
                  <input
                    value={newStudentGoals}
                    onChange={(e) => setNewStudentGoals(e.target.value)}
                    placeholder="Torah reading, conversation..."
                    style={{
                      width: '100%', padding: '12px 16px', background: '#ffffff',
                      border: '2px solid #d1d5db', borderRadius: '8px', color: '#111827',
                      fontSize: '15px'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading || !newStudentName || !newStudentEmail}
                style={{
                  padding: '16px',
                  background: (!newStudentName || !newStudentEmail) ? '#e5e7eb' : '#3b82f6',
                  border: 'none', borderRadius: '8px',
                  color: (!newStudentName || !newStudentEmail) ? '#9ca3af' : '#ffffff',
                  fontSize: '16px', fontWeight: 700, 
                  cursor: (!newStudentName || !newStudentEmail) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '⏳ Registering...' : '👤 Register Student'}
              </button>

              {registerResult && (
                <div style={{
                  padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac',
                  borderRadius: '8px', color: '#166534', fontSize: '14px', fontWeight: 600
                }}>
                  {registerResult}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div>
            <select
              value={selectedStudent}
              onChange={(e) => {
                setSelectedStudent(e.target.value)
                const s = students.find(s => s.user_id === e.target.value)
                if (s) loadHistory(s.student_name)
              }}
              style={{
                width: '100%', padding: '12px 16px', background: '#ffffff',
                border: '2px solid #d1d5db', borderRadius: '8px', color: '#111827',
                fontSize: '15px', marginBottom: '20px'
              }}
            >
              <option value="">-- Select student --</option>
              {students.map(s => (
                <option key={s.user_id} value={s.user_id}>{s.student_name}</option>
              ))}
            </select>

            {lessons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
                {selectedStudent ? 'No lessons yet.' : 'Select a student above.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    style={{
                      padding: '16px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                      Lesson {lesson.lesson_number} • {lesson.lesson_date}
                    </div>
                    {lesson.summary && (
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px' }}>
                        {lesson.summary.substring(0, 150)}...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}