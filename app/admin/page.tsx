'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Student {
  id: string
  user_id: string
  student_name: string
  native_language: string
  current_level: string
}

interface ImportResult {
  success: boolean
  lesson_id: string
  cards_created: number
  message: string
}

const EXAMPLE_JSON = `{
  "lesson_number": 1,
  "lesson_date": "${new Date().toISOString().split('T')[0]}",
  "summary": "Trial lesson. Covered basic greetings and self-introduction...",
  "vocabulary": [
    {"front": "שָׁלוֹם", "back": "Hello / Peace", "transliteration": "shalom", "category": "greetings"},
    {"front": "מַה שְׁלוֹמְךָ", "back": "How are you? (m)", "transliteration": "ma shlomkha", "category": "phrases"}
  ],
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
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'import' | 'register' | 'history'>('import')
  
  const [newStudentEmail, setNewStudentEmail] = useState('')
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentLang, setNewStudentLang] = useState('en')
  const [newStudentGoals, setNewStudentGoals] = useState('')
  const [registerResult, setRegisterResult] = useState<string | null>(null)

  const [lessons, setLessons] = useState<any[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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

  async function handleImport() {
    setError(null)
    setResult(null)

    if (!selectedStudent) {
      setError('Select a student first')
      return
    }

    let parsed: any
    try {
      parsed = JSON.parse(jsonInput)
    } catch {
      setError('Invalid JSON. Copy the exact output from Claude.')
      return
    }

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
          lesson_number: parsed.lesson_number,
          lesson_date: parsed.lesson_date,
          summary: parsed.summary,
          vocabulary: parsed.vocabulary || [],
          analysis: parsed.analysis || {}
        })
      })

      const data = await res.json()

      if (data.success) {
        setResult(data)
        setJsonInput('')
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
              onClick={handleImport}
              disabled={loading || !selectedStudent || !jsonInput}
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
              {loading ? '⏳ Importing...' : '🚀 Import Lesson'}
            </button>
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
