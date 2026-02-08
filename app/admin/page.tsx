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

// Example JSON template shown to user
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
  
  // New student form
  const [newStudentEmail, setNewStudentEmail] = useState('')
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentLang, setNewStudentLang] = useState('en')
  const [newStudentGoals, setNewStudentGoals] = useState('')
  const [registerResult, setRegisterResult] = useState<string | null>(null)

  // Lesson history
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
      // Look up user by email in auth.users (needs service role)
      // For now, we'll create the profile and the student can sign up separately
      // OR if they already have an account, we match by email
      
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id')
      
      // Try to find user by checking if email matches
      // This is a simplified approach - in production you'd use admin API
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
        setRegisterResult(`✅ ${newStudentName} registered! They can now sign up at your website.`)
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
      backgroundColor: '#0a0a0f',
      color: '#e0e0e0',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid #1a1a2e',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
            🎛️ Lesson Control Panel
          </h1>
          <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>
            Import lesson data → Student gets personalized flashcards
          </p>
        </div>
        <div style={{ fontSize: '11px', color: '#444' }}>
          {students.length} students registered
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0',
        borderBottom: '1px solid #1a1a2e',
        padding: '0 24px'
      }}>
        {(['import', 'register', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #4ade80' : '2px solid transparent',
              color: activeTab === tab ? '#4ade80' : '#666',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'inherit'
            }}
          >
            {tab === 'import' ? '📥 Import Lesson' : tab === 'register' ? '👤 Add Student' : '📋 History'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>

        {/* Error / Success Messages */}
        {error && (
          <div style={{
            background: '#2d1215',
            border: '1px solid #7f1d1d',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#fca5a5'
          }}>
            ❌ {error}
          </div>
        )}

        {result && (
          <div style={{
            background: '#052e16',
            border: '1px solid #166534',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#86efac'
          }}>
            ✅ {result.message}
          </div>
        )}

        {/* ============ IMPORT TAB ============ */}
        {activeTab === 'import' && (
          <div>
            {/* Step 1: Select Student */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px',
                color: '#888',
                marginBottom: '8px'
              }}>
                Step 1: Select Student
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
                  background: '#111118',
                  border: '1px solid #2a2a3e',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '15px',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">-- Choose student --</option>
                {students.map(s => (
                  <option key={s.user_id} value={s.user_id}>
                    {s.student_name} ({s.native_language}) — {s.current_level}
                  </option>
                ))}
              </select>
              
              {students.length === 0 && (
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  No students yet. Go to "Add Student" tab first.
                </p>
              )}
            </div>

            {/* Step 2: Paste JSON */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1.5px',
                  color: '#888'
                }}>
                  Step 2: Paste Lesson JSON from Claude
                </label>
                <button
                  onClick={() => setJsonInput(EXAMPLE_JSON)}
                  style={{
                    background: 'none',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    color: '#666',
                    padding: '4px 8px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Load Example
                </button>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste the JSON output from Claude here...'
                rows={16}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#0d0d14',
                  border: '1px solid #2a2a3e',
                  borderRadius: '8px',
                  color: '#a3e635',
                  fontSize: '13px',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  lineHeight: '1.6',
                  resize: 'vertical'
                }}
              />
              
              {/* Preview */}
              {jsonInput && (() => {
                try {
                  const parsed = JSON.parse(jsonInput)
                  return (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px 16px',
                      background: '#111118',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#888'
                    }}>
                      <strong style={{ color: '#fff' }}>Preview:</strong>{' '}
                      Lesson {parsed.lesson_number} • {parsed.lesson_date} • {' '}
                      <span style={{ color: '#4ade80' }}>{parsed.vocabulary?.length || 0} flashcards</span> • {' '}
                      <span style={{ color: '#fbbf24' }}>{parsed.analysis?.struggles?.length || 0} struggles</span>
                      {parsed.summary && (
                        <p style={{ marginTop: '8px', color: '#666', lineHeight: '1.4' }}>
                          {parsed.summary.substring(0, 150)}...
                        </p>
                      )}
                    </div>
                  )
                } catch {
                  return (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#ef4444' }}>
                      ⚠️ Invalid JSON — check formatting
                    </div>
                  )
                }
              })()}
            </div>

            {/* Step 3: Import */}
            <button
              onClick={handleImport}
              disabled={loading || !selectedStudent || !jsonInput}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#1a1a2e' : (!selectedStudent || !jsonInput) ? '#1a1a2e' : '#166534',
                border: 'none',
                borderRadius: '8px',
                color: loading ? '#666' : (!selectedStudent || !jsonInput) ? '#444' : '#fff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading ? 'wait' : (!selectedStudent || !jsonInput) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}
            >
              {loading ? '⏳ Importing...' : '🚀 Import Lesson & Create Flashcards'}
            </button>

            {/* How it works */}
            <div style={{
              marginTop: '32px',
              padding: '20px',
              background: '#111118',
              borderRadius: '8px',
              border: '1px solid #1a1a2e'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
                How this works:
              </h3>
              <div style={{ fontSize: '12px', color: '#888', lineHeight: '2' }}>
                <div>1️⃣ Teach lesson → Record → Transcribe in Colab</div>
                <div>2️⃣ Paste transcript to Claude → Get JSON output</div>
                <div>3️⃣ Paste JSON here → Click Import</div>
                <div>4️⃣ Student logs in → Sees new flashcards + lesson summary</div>
              </div>
            </div>
          </div>
        )}

        {/* ============ REGISTER TAB ============ */}
        {activeTab === 'register' && (
          <div>
            <div style={{
              padding: '16px',
              background: '#111118',
              borderRadius: '8px',
              border: '1px solid #1a1a2e',
              marginBottom: '24px',
              fontSize: '12px',
              color: '#888',
              lineHeight: '1.6'
            }}>
              <strong style={{ color: '#fff' }}>How student accounts work:</strong><br/>
              1. You register the student here (name + email)<br/>
              2. Student signs up on your website with that email<br/>
              3. The system links their account to their lesson data<br/>
              4. They see personalized flashcards when they log in
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', marginBottom: '6px' }}>
                  Student Name
                </label>
                <input
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Nikolai"
                  style={{
                    width: '100%', padding: '12px 16px', background: '#0d0d14',
                    border: '1px solid #2a2a3e', borderRadius: '8px', color: '#fff',
                    fontSize: '14px', fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', marginBottom: '6px' }}>
                  Email (must match their signup email)
                </label>
                <input
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="nikolai@example.com"
                  type="email"
                  style={{
                    width: '100%', padding: '12px 16px', background: '#0d0d14',
                    border: '1px solid #2a2a3e', borderRadius: '8px', color: '#fff',
                    fontSize: '14px', fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', marginBottom: '6px' }}>
                    Native Language
                  </label>
                  <select
                    value={newStudentLang}
                    onChange={(e) => setNewStudentLang(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 16px', background: '#0d0d14',
                      border: '1px solid #2a2a3e', borderRadius: '8px', color: '#fff',
                      fontSize: '14px', fontFamily: 'inherit'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="ru">Russian</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                    <option value="nl">Dutch</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', marginBottom: '6px' }}>
                    Learning Goals
                  </label>
                  <input
                    value={newStudentGoals}
                    onChange={(e) => setNewStudentGoals(e.target.value)}
                    placeholder="Torah reading, conversational Hebrew..."
                    style={{
                      width: '100%', padding: '12px 16px', background: '#0d0d14',
                      border: '1px solid #2a2a3e', borderRadius: '8px', color: '#fff',
                      fontSize: '14px', fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading || !newStudentName || !newStudentEmail}
                style={{
                  padding: '14px',
                  background: (!newStudentName || !newStudentEmail) ? '#1a1a2e' : '#1e40af',
                  border: 'none', borderRadius: '8px',
                  color: (!newStudentName || !newStudentEmail) ? '#444' : '#fff',
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                {loading ? '⏳ Registering...' : '👤 Register Student'}
              </button>

              {registerResult && (
                <div style={{
                  padding: '12px 16px', background: '#052e16', border: '1px solid #166534',
                  borderRadius: '8px', fontSize: '13px', color: '#86efac'
                }}>
                  {registerResult}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ HISTORY TAB ============ */}
        {activeTab === 'history' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <select
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value)
                  const s = students.find(s => s.user_id === e.target.value)
                  if (s) loadHistory(s.student_name)
                }}
                style={{
                  width: '100%', padding: '12px 16px', background: '#111118',
                  border: '1px solid #2a2a3e', borderRadius: '8px', color: '#fff',
                  fontSize: '14px', fontFamily: 'inherit'
                }}
              >
                <option value="">-- Select student to view history --</option>
                {students.map(s => (
                  <option key={s.user_id} value={s.user_id}>{s.student_name}</option>
                ))}
              </select>
            </div>

            {lessons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#444' }}>
                {selectedStudent ? 'No lessons imported yet for this student.' : 'Select a student above.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    style={{
                      padding: '16px 20px',
                      background: '#111118',
                      border: '1px solid #1a1a2e',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#fff' }}>
                        Lesson {lesson.lesson_number}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {lesson.lesson_date}
                      </span>
                    </div>
                    {lesson.summary && (
                      <p style={{ fontSize: '13px', color: '#888', margin: '0 0 8px', lineHeight: '1.5' }}>
                        {lesson.summary.substring(0, 200)}{lesson.summary.length > 200 ? '...' : ''}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                      {lesson.vocabulary && (
                        <span style={{ color: '#4ade80' }}>
                          📚 {Array.isArray(lesson.vocabulary) ? lesson.vocabulary.length : 0} vocab items
                        </span>
                      )}
                      {lesson.analysis?.struggles && (
                        <span style={{ color: '#fbbf24' }}>
                          ⚠️ {lesson.analysis.struggles.length} struggles
                        </span>
                      )}
                    </div>
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
