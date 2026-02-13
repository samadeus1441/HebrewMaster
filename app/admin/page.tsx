'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// ═══════════════════════════════════════════════════════════════
// HEBREW MASTER — ADMIN CONTROL PANEL v2
// Full lesson corpus import with nikud review
// ═══════════════════════════════════════════════════════════════

// --- TYPES ---
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

interface GrammarPoint {
  pattern_he: string; pattern_en: string; explanation: string;
  examples: string[];
}

interface LessonData {
  lesson_number: number | string;
  lesson_date: string;
  topic_title: string;
  summary: string;
  vocabulary: VocabularyItem[];
  conversation_practice?: ConversationPractice;
  additional_scenarios?: ConversationPractice[];
  grammar_points?: GrammarPoint[];
  cultural_notes?: string[];
  homework?: string[];
  analysis: {
    struggles?: string[];
    strengths?: string[];
    recommendations?: string[];
    talk_ratio?: { student: number; teacher: number };
    hebrew_percentage?: number;
    notes?: string;
  };
}

interface ImportResult {
  success: boolean; lesson_id: string;
  cards_created: number; message: string;
}

// --- NIKUD DETECTION ---
function hasNikud(text: string): boolean {
  return /[\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/.test(text)
}

function flagIssues(item: VocabularyItem): string[] {
  const flags: string[] = []
  if (!hasNikud(item.front) && /[\u0590-\u05FF]/.test(item.front)) flags.push('⚠️ No nikud')
  if (!item.transliteration || item.transliteration.trim() === '') flags.push('⚠️ No transliteration')
  if (!item.back || item.back.trim() === '') flags.push('⚠️ No translation')
  if (!item.category || item.category.trim() === '') flags.push('💡 No category')
  if (item.front.length < 2) flags.push('⚠️ Very short')
  return flags
}

// --- EXAMPLE JSON (expanded) ---
const EXAMPLE_JSON = `{
  "lesson_number": 1,
  "lesson_date": "${new Date().toISOString().split('T')[0]}",
  "topic_title": "Getting to Know You — Family & Greetings",
  "summary": "Trial lesson focused on basic greetings, family vocabulary, and self-introduction.",
  "vocabulary": [
    {"front": "שָׁלוֹם", "back": "Hello / Peace", "transliteration": "shalom", "category": "greetings"},
    {"front": "מַה שְׁלוֹמְךָ", "back": "How are you? (m)", "transliteration": "ma shlomkha", "category": "phrases"},
    {"front": "מִשְׁפָּחָה", "back": "Family", "transliteration": "mishpacha", "category": "family"}
  ],
  "conversation_practice": {
    "title": "Meeting a New Friend",
    "context": "You're at a café in Tel Aviv",
    "dialogue": [
      {"speaker": "Teacher", "text_he": "שָׁלוֹם! מַה שִּׁמְךָ?", "text_en": "Hello! What's your name?"},
      {"speaker": "Student", "text_he": "שָׁלוֹם, שְׁמִי דָּן", "text_en": "Hello, my name is Dan"}
    ]
  },
  "additional_scenarios": [
    {
      "title": "Ordering at the Shuk",
      "context": "Buying vegetables at Machane Yehuda",
      "dialogue": [
        {"speaker": "Vendor", "text_he": "בּוֹקֶר טוֹב! מָה תִּרְצֶה?", "text_en": "Good morning! What would you like?"},
        {"speaker": "Student", "text_he": "עַגְבָנִיּוֹת בְּבַקָּשָׁה", "text_en": "Tomatoes, please"}
      ]
    }
  ],
  "grammar_points": [
    {
      "pattern_he": "אֲנִי + [שֵׁם/תוֹאַר]",
      "pattern_en": "I am + [noun/adjective]",
      "explanation": "No copula needed in present tense Hebrew.",
      "examples": ["אֲנִי דָּן", "אֲנִי שָׂמֵחַ"]
    }
  ],
  "cultural_notes": ["Israelis use first names immediately, even in business"],
  "homework": ["Practice introducing yourself with different details each time"],
  "analysis": {
    "struggles": ["Gender agreement", "Pronunciation of ח"],
    "strengths": ["Good ear for vowels", "Quick recall"],
    "recommendations": ["Drill greetings", "Practice ח vs כ"],
    "talk_ratio": {"student": 35, "teacher": 65},
    "hebrew_percentage": 20,
    "notes": "Motivated student, learns through conversation"
  }
}`

// --- CLAUDE/OPENAI PROMPT ---
const PROMPT_TEXT = `You are a Hebrew language teaching assistant. Analyze a lesson transcript and produce structured JSON for a student learning platform.

CRITICAL RULES FOR HEBREW TEXT:
1. ALL Hebrew words MUST include full nikud (vowel points). Never write Hebrew without nikud.
2. Use standard Israeli nikud: קָמָץ, פַּתָח, צֵירֵי, סֵגוֹל, חִירִיק, חוֹלָם, שׁוּרוּק/קוּבּוּץ, שְׁוָא.
3. Include דָּגֵשׁ where applicable: בּ, כּ, פּ etc.
4. Transliterations must match the nikud precisely.

LESSON CONTEXT:
- Student name: [STUDENT_NAME]
- Student native language: [NATIVE_LANGUAGE]
- Lesson number: [LESSON_NUMBER]
- Date: [DATE]
- Topic: [TOPIC]

TRANSCRIPT:
[PASTE TRANSCRIPT HERE]

OUTPUT FORMAT (strict JSON — no markdown, no code fences):
{
  "lesson_number": [number],
  "lesson_date": "[YYYY-MM-DD]",
  "topic_title": "[Short descriptive title]",
  "summary": "[2-3 sentence summary]",

  "vocabulary": [
    {
      "front": "[Hebrew WITH FULL NIKUD]",
      "back": "[English translation]",
      "transliteration": "[phonetic, matching nikud]",
      "category": "[greetings|family|food|travel|verbs|adjectives|phrases|expressions|commands|encouragement|numbers|time|shopping|body|emotions|work|nature|religious]"
    }
  ],

  "conversation_practice": {
    "title": "[Scenario title from lesson content]",
    "context": "[1-2 sentence setting]",
    "dialogue": [
      {
        "speaker": "[Teacher/Student/Vendor/Friend/etc.]",
        "text_he": "[Hebrew WITH FULL NIKUD]",
        "text_en": "[English translation]",
        "type": "statement"
      }
    ]
  },

  "additional_scenarios": [
    {
      "title": "[Extra scenario title]",
      "context": "[Setting]",
      "dialogue": [...]
    }
  ],

  "grammar_points": [
    {
      "pattern_he": "[Hebrew pattern with nikud]",
      "pattern_en": "[English pattern]",
      "explanation": "[Clear explanation]",
      "examples": ["[example with nikud]", "[example with nikud]"]
    }
  ],

  "cultural_notes": ["[Cultural insight from the lesson]"],

  "homework": ["[Practice task for student]"],

  "analysis": {
    "struggles": ["[Specific error with Hebrew example]"],
    "strengths": ["[What student did well]"],
    "recommendations": ["[Focus for next lesson]"],
    "talk_ratio": {"student": [0-100], "teacher": [0-100]},
    "hebrew_percentage": [0-100],
    "notes": "[Teacher notes on progress/personality]"
  }
}

IMPORTANT:
- Extract EVERY Hebrew word/phrase taught or practiced (15-40 items per lesson)
- Create scenarios that reflect what was ACTUALLY discussed, not generic dialogues
- Capture grammar patterns even if briefly explained
- Include cultural context the teacher mentioned
- Be generous with vocabulary — include phrases, expressions, and incidental words

Return ONLY the JSON object.`

export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'import' | 'register' | 'history' | 'prompt'>('import')
  const [isReviewing, setIsReviewing] = useState(false)
  const [parsedData, setParsedData] = useState<LessonData | null>(null)
  const [previewIdx, setPreviewIdx] = useState<number | null>(null)

  // Register
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

  useEffect(() => { loadStudents() }, [])

  async function loadStudents() {
    const res = await fetch('/api/import-lesson')
    const data = await res.json()
    if (data.students) setStudents(data.students)
  }

  async function loadHistory(studentName: string) {
    const { data } = await supabase
      .from('lessons')
      .select('id, student_name, lesson_number, lesson_date, topic_title, summary, vocabulary, analysis, created_at')
      .eq('student_name', studentName)
      .order('lesson_number', { ascending: false })
    setLessons(data || [])
  }

  // --- PARSE & REVIEW ---
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
        additional_scenarios: parsed.additional_scenarios || [],
        grammar_points: parsed.grammar_points || [],
        cultural_notes: parsed.cultural_notes || [],
        homework: parsed.homework || [],
        analysis: parsed.analysis || {},
      }
      setParsedData(safeData)
      setIsReviewing(true)
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message)
    }
  }

  // --- EDIT HELPERS ---
  const updateVocab = (i: number, field: keyof VocabularyItem, value: string) => {
    if (!parsedData) return
    const v = [...parsedData.vocabulary]
    v[i] = { ...v[i], [field]: value }
    setParsedData({ ...parsedData, vocabulary: v })
  }

  const addVocab = () => {
    if (!parsedData) return
    setParsedData({ ...parsedData, vocabulary: [...parsedData.vocabulary, { front: '', back: '', transliteration: '', category: '' }] })
  }

  const removeVocab = (i: number) => {
    if (!parsedData) return
    const v = [...parsedData.vocabulary]; v.splice(i, 1)
    setParsedData({ ...parsedData, vocabulary: v })
  }

  const updateDialogue = (scenarioKey: 'conversation_practice' | number, i: number, field: keyof DialogueTurn, value: string) => {
    if (!parsedData) return
    if (scenarioKey === 'conversation_practice' && parsedData.conversation_practice) {
      const d = [...parsedData.conversation_practice.dialogue]
      d[i] = { ...d[i], [field]: value }
      setParsedData({ ...parsedData, conversation_practice: { ...parsedData.conversation_practice, dialogue: d } })
    } else if (typeof scenarioKey === 'number' && parsedData.additional_scenarios) {
      const scenarios = [...parsedData.additional_scenarios]
      const d = [...scenarios[scenarioKey].dialogue]
      d[i] = { ...d[i], [field]: value }
      scenarios[scenarioKey] = { ...scenarios[scenarioKey], dialogue: d }
      setParsedData({ ...parsedData, additional_scenarios: scenarios })
    }
  }

  const addDialogueTurn = (scenarioKey: 'conversation_practice' | number) => {
    if (!parsedData) return
    const newTurn: DialogueTurn = { speaker: 'Student', text_he: '', text_en: '', type: 'statement' }
    if (scenarioKey === 'conversation_practice' && parsedData.conversation_practice) {
      setParsedData({ ...parsedData, conversation_practice: { ...parsedData.conversation_practice, dialogue: [...parsedData.conversation_practice.dialogue, newTurn] } })
    } else if (typeof scenarioKey === 'number' && parsedData.additional_scenarios) {
      const scenarios = [...parsedData.additional_scenarios]
      scenarios[scenarioKey] = { ...scenarios[scenarioKey], dialogue: [...scenarios[scenarioKey].dialogue, newTurn] }
      setParsedData({ ...parsedData, additional_scenarios: scenarios })
    }
  }

  const removeDialogueTurn = (scenarioKey: 'conversation_practice' | number, i: number) => {
    if (!parsedData) return
    if (scenarioKey === 'conversation_practice' && parsedData.conversation_practice) {
      const d = [...parsedData.conversation_practice.dialogue]; d.splice(i, 1)
      setParsedData({ ...parsedData, conversation_practice: { ...parsedData.conversation_practice, dialogue: d } })
    } else if (typeof scenarioKey === 'number' && parsedData.additional_scenarios) {
      const scenarios = [...parsedData.additional_scenarios]
      const d = [...scenarios[scenarioKey].dialogue]; d.splice(i, 1)
      scenarios[scenarioKey] = { ...scenarios[scenarioKey], dialogue: d }
      setParsedData({ ...parsedData, additional_scenarios: scenarios })
    }
  }

  // --- FINAL IMPORT ---
  async function handleFinalImport() {
    if (!selectedStudent || !parsedData) return
    const student = students.find(s => s.user_id === selectedStudent)
    if (!student) { setError('Student not found'); return }
    setLoading(true); setError(null)

    try {
      const res = await fetch('/api/import-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_user_id: student.user_id,
          student_name: student.student_name,
          lesson_number: Number(parsedData.lesson_number),
          lesson_date: parsedData.lesson_date,
          topic_title: parsedData.topic_title,
          summary: parsedData.summary,
          vocabulary: parsedData.vocabulary || [],
          conversation_practice: parsedData.conversation_practice,
          additional_scenarios: parsedData.additional_scenarios || [],
          grammar_points: parsedData.grammar_points || [],
          cultural_notes: parsedData.cultural_notes || [],
          homework: parsedData.homework || [],
          analysis: parsedData.analysis || {},
        })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data); setJsonInput(''); setIsReviewing(false); setParsedData(null)
        loadHistory(student.student_name)
      } else setError(data.error || 'Import failed')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleRegister() {
    setRegisterResult(null); setError(null)
    if (!newStudentEmail || !newStudentName) { setError('Name and email required'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/register-student', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newStudentEmail, student_name: newStudentName, native_language: newStudentLang, learning_goals: newStudentGoals }) })
      const data = await res.json()
      if (data.success) {
        setRegisterResult(`✅ ${newStudentName} registered!${data.temp_password ? ` Temp: ${data.temp_password}` : ''}`)
        setNewStudentEmail(''); setNewStudentName(''); setNewStudentGoals(''); loadStudents()
      } else setError(data.error || 'Failed')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  // --- STYLES ---
  const S = {
    input: { width: '100%', padding: '10px 14px', border: '1px solid #E5E5E0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' as const },
    label: { display: 'block' as const, fontSize: '12px', fontWeight: 700 as const, color: '#6B7280', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
    card: { background: 'white', border: '1px solid #E5E5E0', borderRadius: '16px', padding: '24px', marginBottom: '16px' },
    sectionTitle: { fontSize: '15px', fontWeight: 700 as const, color: '#1A1A2E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
    flag: { fontSize: '11px', fontWeight: 600 as const, padding: '2px 8px', borderRadius: '8px', background: '#FFF7ED', color: '#9A3412', border: '1px solid #FDBA74' },
    flagOk: { fontSize: '11px', fontWeight: 600 as const, padding: '2px 8px', borderRadius: '8px', background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' },
    deleteBtn: { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px', padding: '4px', lineHeight: 1 as const },
    addBtn: { background: '#F5F5F3', border: '1px dashed #D1D5DB', borderRadius: '10px', padding: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 as const, color: '#6B7280', width: '100%', textAlign: 'center' as const },
  }

  const tabStyle = (active: boolean) => ({
    padding: '14px 24px', background: 'none', border: 'none',
    borderBottom: active ? '3px solid #1E3A5F' : '3px solid transparent',
    color: active ? '#1E3A5F' : '#9CA3AF', cursor: 'pointer',
    fontSize: '13px', fontWeight: 700 as const, textTransform: 'uppercase' as const, letterSpacing: '0.5px',
  })

  function renderDialogueEditor(dialogue: DialogueTurn[], scenarioKey: 'conversation_practice' | number) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#FAFAF8', padding: '12px', borderRadius: '10px', border: '1px solid #E5E5E0' }}>
          {dialogue.map((turn, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ width: 90, flexShrink: 0 }}>
                <input value={turn.speaker} onChange={e => updateDialogue(scenarioKey, idx, 'speaker', e.target.value)}
                  style={{ ...S.input, fontWeight: 700, fontSize: '11px', textAlign: 'center', padding: '6px 4px' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <input value={turn.text_he} onChange={e => updateDialogue(scenarioKey, idx, 'text_he', e.target.value)} dir="rtl"
                  style={{ ...S.input, fontFamily: '"Frank Ruhl Libre", serif', fontSize: '16px', fontWeight: 700, padding: '8px' }} />
                <input value={turn.text_en} onChange={e => updateDialogue(scenarioKey, idx, 'text_en', e.target.value)}
                  style={{ ...S.input, border: 'none', background: 'transparent', fontSize: '12px', color: '#9CA3AF', padding: '4px 8px' }}
                  placeholder="Translation..." />
              </div>
              <button onClick={() => removeDialogueTurn(scenarioKey, idx)} style={S.deleteBtn} title="Remove">×</button>
            </div>
          ))}
        </div>
        <button onClick={() => addDialogueTurn(scenarioKey)} style={{ ...S.addBtn, marginTop: '6px' }}>+ Add dialogue turn</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', color: '#1A1A2E', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #E5E5E0', padding: '20px 32px', background: 'white' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E', margin: 0, fontFamily: '"Fraunces", serif' }}>🎛️ Lesson Control Panel</h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '4px 0 0' }}>Import → Review nikud → Student gets flashcards & scenarios ({students.length} students)</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E5E0', padding: '0 32px', background: 'white' }}>
        {(['import', 'register', 'history', 'prompt'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setIsReviewing(false) }} style={tabStyle(activeTab === tab)}>
            {tab === 'import' ? '📥 Import' : tab === 'register' ? '👤 Add Student' : tab === 'history' ? '📋 History' : '🤖 AI Prompt'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 32px' }}>
        {error && <div style={{ background: '#FFF7ED', border: '1px solid #FDBA74', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#9A3412', fontSize: '14px', fontWeight: 600 }}>⚠️ {error}</div>}
        {result && <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#065F46', fontSize: '14px', fontWeight: 600 }}>✅ {result.message}</div>}

        {/* ═══════════════ IMPORT TAB ═══════════════ */}
        {activeTab === 'import' && (
          <div>
            {!isReviewing ? (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={S.label}>Select Student</label>
                  <select value={selectedStudent} onChange={e => { setSelectedStudent(e.target.value); const s = students.find(s => s.user_id === e.target.value); if (s) loadHistory(s.student_name) }}
                    style={{ ...S.input, cursor: 'pointer' }}>
                    <option value="">-- Choose student --</option>
                    {students.map(s => <option key={s.user_id} value={s.user_id}>{s.student_name} ({s.native_language})</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ ...S.label, margin: 0 }}>Paste Lesson JSON</label>
                    <button onClick={() => setJsonInput(EXAMPLE_JSON)} style={{ background: '#F5F5F3', border: '1px solid #E5E5E0', borderRadius: '8px', color: '#6B7280', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Load Example</button>
                  </div>
                  <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} placeholder='Paste JSON from Claude or ChatGPT...' rows={14}
                    style={{ ...S.input, fontFamily: "'Courier New', monospace", fontSize: '12px', lineHeight: '1.6', resize: 'vertical' }} />
                </div>
                <button onClick={handleParseAndReview} disabled={!selectedStudent || !jsonInput}
                  style={{ width: '100%', padding: '14px', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700,
                    cursor: (!selectedStudent || !jsonInput) ? 'not-allowed' : 'pointer',
                    background: (!selectedStudent || !jsonInput) ? '#E5E5E0' : 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
                    color: (!selectedStudent || !jsonInput) ? '#9CA3AF' : 'white',
                    boxShadow: (!selectedStudent || !jsonInput) ? 'none' : '0 4px 16px rgba(30,58,95,0.25)' }}>
                  🔍 Parse & Review
                </button>
              </>
            ) : parsedData && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A2E', margin: 0, fontFamily: '"Fraunces", serif' }}>Review: Lesson {parsedData.lesson_number}</h2>
                  <button onClick={() => setIsReviewing(false)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>← Back</button>
                </div>

                {/* METADATA */}
                <div style={S.card}>
                  <div style={S.sectionTitle}>📋 Lesson Info</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '12px', marginBottom: '12px' }}>
                    <div><label style={S.label}>Number</label><input type="number" value={parsedData.lesson_number} onChange={e => setParsedData({...parsedData, lesson_number: e.target.value})} style={S.input} /></div>
                    <div><label style={S.label}>Date</label><input type="date" value={parsedData.lesson_date} onChange={e => setParsedData({...parsedData, lesson_date: e.target.value})} style={S.input} /></div>
                    <div><label style={S.label}>Topic Title</label><input value={parsedData.topic_title} onChange={e => setParsedData({...parsedData, topic_title: e.target.value})} placeholder="e.g. Family & Greetings" style={S.input} /></div>
                  </div>
                  <div><label style={S.label}>Summary</label><textarea value={parsedData.summary} onChange={e => setParsedData({...parsedData, summary: e.target.value})} style={{...S.input, height: '70px', resize: 'vertical'}} /></div>
                </div>

                {/* ══════ NIKUD PREVIEW PANEL ══════ */}
                <div style={S.card}>
                  <div style={{...S.sectionTitle, justifyContent: 'space-between'}}>
                    <span>📚 Vocabulary <span style={{fontSize: '12px', background: '#E8EEF4', padding: '2px 10px', borderRadius: '12px', color: '#1E3A5F'}}>{parsedData.vocabulary.length} words</span></span>
                    <span style={{fontSize: '12px', color: '#9CA3AF'}}>{parsedData.vocabulary.filter(v => hasNikud(v.front)).length}/{parsedData.vocabulary.length} have nikud</span>
                  </div>

                  {/* BIG HEBREW PREVIEW */}
                  <div style={{ background: '#FEFDF8', border: '1px solid #E5E5E0', borderRadius: '12px', padding: '20px', marginBottom: '16px', direction: 'rtl' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', direction: 'ltr' }}>
                      👁️ NIKUD PREVIEW — Click any word to inspect. Orange border = issue detected.
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {parsedData.vocabulary.map((item, idx) => {
                        const issues = flagIssues(item)
                        const hasIssues = issues.some(f => f.startsWith('⚠️'))
                        return (
                          <button key={idx} onClick={() => setPreviewIdx(previewIdx === idx ? null : idx)}
                            style={{
                              fontFamily: '"Frank Ruhl Libre", serif', fontSize: previewIdx === idx ? '32px' : '22px', fontWeight: 700, color: '#1A1A2E',
                              background: previewIdx === idx ? '#E8EEF4' : hasIssues ? '#FFF7ED' : 'white',
                              border: `2px solid ${previewIdx === idx ? '#1E3A5F' : hasIssues ? '#FDBA74' : '#E5E5E0'}`,
                              borderRadius: '10px', padding: previewIdx === idx ? '12px 16px' : '6px 12px', cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
                            }}>
                            {item.front}
                            {hasIssues && <span style={{ position: 'absolute', top: -6, right: -6, background: '#F97316', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</span>}
                          </button>
                        )
                      })}
                    </div>

                    {previewIdx !== null && parsedData.vocabulary[previewIdx] && (
                      <div style={{ marginTop: '16px', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #E5E5E0', direction: 'ltr' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: '"Frank Ruhl Libre", serif', fontSize: '48px', fontWeight: 700, color: '#1A1A2E', direction: 'rtl', lineHeight: 1.2 }}>{parsedData.vocabulary[previewIdx].front}</div>
                            <div style={{ fontSize: '14px', color: '#2563EB', fontFamily: 'monospace', marginTop: '4px' }}>{parsedData.vocabulary[previewIdx].transliteration || '(no transliteration)'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A2E' }}>{parsedData.vocabulary[previewIdx].back}</div>
                            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Category: {parsedData.vocabulary[previewIdx].category || 'none'}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {flagIssues(parsedData.vocabulary[previewIdx]).map((f, i) => <span key={i} style={f.startsWith('💡') ? S.flagOk : S.flag}>{f}</span>)}
                            {flagIssues(parsedData.vocabulary[previewIdx]).length === 0 && <span style={S.flagOk}>✓ Looks good</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* EDITABLE TABLE */}
                  <div style={{ overflowX: 'auto', border: '1px solid #E5E5E0', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead style={{ background: '#F5F5F3', borderBottom: '1px solid #E5E5E0' }}>
                        <tr>
                          <th style={{ padding: '10px 8px', textAlign: 'left', width: '5%', color: '#9CA3AF' }}>#</th>
                          <th style={{ padding: '10px 8px', textAlign: 'right', width: '22%' }}>Hebrew</th>
                          <th style={{ padding: '10px 8px', textAlign: 'left', width: '20%' }}>Transliteration</th>
                          <th style={{ padding: '10px 8px', textAlign: 'left', width: '23%' }}>English</th>
                          <th style={{ padding: '10px 8px', textAlign: 'left', width: '15%' }}>Category</th>
                          <th style={{ padding: '10px 8px', textAlign: 'center', width: '10%' }}>OK?</th>
                          <th style={{ padding: '10px 8px', width: '5%' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.vocabulary.map((item, idx) => {
                          const issues = flagIssues(item)
                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6', background: issues.some(f => f.startsWith('⚠️')) ? '#FFFBF5' : 'transparent' }}>
                              <td style={{ padding: '6px 8px', color: '#D1D5DB', fontSize: '11px' }}>{idx + 1}</td>
                              <td style={{ padding: '6px 8px' }}>
                                <input value={item.front} onChange={e => updateVocab(idx, 'front', e.target.value)} dir="rtl" onClick={() => setPreviewIdx(idx)}
                                  style={{ ...S.input, textAlign: 'right', fontFamily: '"Frank Ruhl Libre", serif', fontSize: '16px', fontWeight: 700, padding: '6px 8px' }} />
                              </td>
                              <td style={{ padding: '6px 8px' }}><input value={item.transliteration} onChange={e => updateVocab(idx, 'transliteration', e.target.value)} style={{ ...S.input, fontFamily: 'monospace', color: '#2563EB', padding: '6px 8px' }} /></td>
                              <td style={{ padding: '6px 8px' }}><input value={item.back} onChange={e => updateVocab(idx, 'back', e.target.value)} style={{ ...S.input, padding: '6px 8px' }} /></td>
                              <td style={{ padding: '6px 8px' }}><input value={item.category} onChange={e => updateVocab(idx, 'category', e.target.value)} style={{ ...S.input, fontSize: '12px', padding: '6px 8px', background: '#F5F5F3' }} /></td>
                              <td style={{ padding: '6px 8px', textAlign: 'center' }}>{issues.length === 0 ? <span style={{ color: '#10B981' }}>✓</span> : <span style={{ color: '#F97316', fontSize: '11px', fontWeight: 600 }}>{issues.length}!</span>}</td>
                              <td style={{ padding: '6px 8px' }}><button onClick={() => removeVocab(idx)} style={S.deleteBtn}>×</button></td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={addVocab} style={{ ...S.addBtn, marginTop: '8px' }}>+ Add word</button>
                </div>

                {/* SCENARIOS */}
                {parsedData.conversation_practice && (
                  <div style={S.card}>
                    <div style={S.sectionTitle}>💬 Main Scenario</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div><label style={S.label}>Title</label><input value={parsedData.conversation_practice.title} onChange={e => setParsedData({...parsedData, conversation_practice: {...parsedData.conversation_practice!, title: e.target.value}})} style={S.input} /></div>
                      <div><label style={S.label}>Context</label><input value={parsedData.conversation_practice.context} onChange={e => setParsedData({...parsedData, conversation_practice: {...parsedData.conversation_practice!, context: e.target.value}})} style={S.input} /></div>
                    </div>
                    {renderDialogueEditor(parsedData.conversation_practice.dialogue, 'conversation_practice')}
                  </div>
                )}

                {parsedData.additional_scenarios?.map((scenario, sIdx) => (
                  <div key={sIdx} style={S.card}>
                    <div style={S.sectionTitle}>💬 Scenario {sIdx + 2}: {scenario.title}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div><label style={S.label}>Title</label><input value={scenario.title} onChange={e => { const s = [...(parsedData.additional_scenarios || [])]; s[sIdx] = {...s[sIdx], title: e.target.value}; setParsedData({...parsedData, additional_scenarios: s}) }} style={S.input} /></div>
                      <div><label style={S.label}>Context</label><input value={scenario.context} onChange={e => { const s = [...(parsedData.additional_scenarios || [])]; s[sIdx] = {...s[sIdx], context: e.target.value}; setParsedData({...parsedData, additional_scenarios: s}) }} style={S.input} /></div>
                    </div>
                    {renderDialogueEditor(scenario.dialogue, sIdx)}
                  </div>
                ))}

                {/* GRAMMAR */}
                {parsedData.grammar_points && parsedData.grammar_points.length > 0 && (
                  <div style={S.card}>
                    <div style={S.sectionTitle}>📐 Grammar Points</div>
                    {parsedData.grammar_points.map((gp, i) => (
                      <div key={i} style={{ background: '#F5F5F3', borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
                        <div style={{ fontFamily: '"Frank Ruhl Libre", serif', fontSize: '20px', fontWeight: 700, direction: 'rtl', color: '#1A1A2E', marginBottom: '4px' }}>{gp.pattern_he}</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E3A5F', marginBottom: '4px' }}>{gp.pattern_en}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>{gp.explanation}</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {gp.examples.map((ex, j) => <span key={j} style={{ fontFamily: '"Frank Ruhl Libre", serif', fontSize: '15px', direction: 'rtl', background: 'white', padding: '2px 8px', borderRadius: '6px', border: '1px solid #E5E5E0' }}>{ex}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CULTURAL NOTES */}
                {parsedData.cultural_notes && parsedData.cultural_notes.length > 0 && (
                  <div style={S.card}>
                    <div style={S.sectionTitle}>🏛️ Cultural Notes</div>
                    {parsedData.cultural_notes.map((note, i) => <div key={i} style={{ background: '#F5F0E8', borderRadius: '8px', padding: '10px 14px', marginBottom: '6px', fontSize: '13px', color: '#4B5563', borderLeft: '3px solid #CFBA8C' }}>{note}</div>)}
                  </div>
                )}

                {/* HOMEWORK */}
                {parsedData.homework && parsedData.homework.length > 0 && (
                  <div style={S.card}>
                    <div style={S.sectionTitle}>📝 Homework</div>
                    {parsedData.homework.map((hw, i) => <div key={i} style={{ background: '#F5F5F3', borderRadius: '8px', padding: '10px 14px', marginBottom: '6px', fontSize: '13px', color: '#4B5563' }}>{i+1}. {hw}</div>)}
                  </div>
                )}

                {/* ANALYSIS */}
                <div style={S.card}>
                  <div style={S.sectionTitle}>📊 Analysis</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div><label style={S.label}>Struggles</label><textarea value={(parsedData.analysis?.struggles || []).join('\n')} onChange={e => setParsedData({...parsedData, analysis: {...parsedData.analysis, struggles: e.target.value.split('\n').filter(Boolean)}})} style={{...S.input, height: '80px', resize: 'vertical', fontSize: '12px'}} placeholder="One per line" /></div>
                    <div><label style={S.label}>Strengths</label><textarea value={(parsedData.analysis?.strengths || []).join('\n')} onChange={e => setParsedData({...parsedData, analysis: {...parsedData.analysis, strengths: e.target.value.split('\n').filter(Boolean)}})} style={{...S.input, height: '80px', resize: 'vertical', fontSize: '12px'}} placeholder="One per line" /></div>
                    <div><label style={S.label}>Recommendations</label><textarea value={(parsedData.analysis?.recommendations || []).join('\n')} onChange={e => setParsedData({...parsedData, analysis: {...parsedData.analysis, recommendations: e.target.value.split('\n').filter(Boolean)}})} style={{...S.input, height: '80px', resize: 'vertical', fontSize: '12px'}} placeholder="One per line" /></div>
                    <div>
                      <label style={S.label}>Talk Ratio & Hebrew %</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1 }}><div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' }}>Student %</div><input type="number" min="0" max="100" value={parsedData.analysis?.talk_ratio?.student || 0} onChange={e => setParsedData({...parsedData, analysis: {...parsedData.analysis, talk_ratio: {student: Number(e.target.value), teacher: 100 - Number(e.target.value)}}})} style={{...S.input, padding: '6px 8px'}} /></div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' }}>Hebrew %</div><input type="number" min="0" max="100" value={parsedData.analysis?.hebrew_percentage || 0} onChange={e => setParsedData({...parsedData, analysis: {...parsedData.analysis, hebrew_percentage: Number(e.target.value)}})} style={{...S.input, padding: '6px 8px'}} /></div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px' }}><label style={S.label}>Teacher Notes</label><textarea value={parsedData.analysis?.notes || ''} onChange={e => setParsedData({...parsedData, analysis: {...parsedData.analysis, notes: e.target.value}})} style={{...S.input, height: '60px', resize: 'vertical', fontSize: '12px'}} /></div>
                </div>

                {/* SUMMARY */}
                <div style={{ background: '#E8EEF4', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E3A5F', marginBottom: '8px' }}>📋 Import Summary</div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#4B5563' }}>
                    <span>📚 {parsedData.vocabulary.length} words</span>
                    <span>💬 {(parsedData.conversation_practice ? 1 : 0) + (parsedData.additional_scenarios?.length || 0)} scenarios</span>
                    <span>📐 {parsedData.grammar_points?.length || 0} grammar</span>
                    <span>🏛️ {parsedData.cultural_notes?.length || 0} cultural</span>
                    <span>📝 {parsedData.homework?.length || 0} homework</span>
                    <span>{parsedData.vocabulary.filter(v => flagIssues(v).some(f => f.startsWith('⚠️'))).length > 0
                      ? `⚠️ ${parsedData.vocabulary.filter(v => flagIssues(v).some(f => f.startsWith('⚠️'))).length} issues`
                      : '✅ All clean'}</span>
                  </div>
                </div>

                <button onClick={handleFinalImport} disabled={loading}
                  style={{ width: '100%', padding: '16px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)', color: 'white', fontSize: '16px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer', boxShadow: '0 4px 16px rgba(30,58,95,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? '⏳ Importing...' : '🚀 Confirm & Import Lesson'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ REGISTER ═══════════════ */}
        {activeTab === 'register' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={S.label}>Student Name</label><input value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Nikolai" style={S.input} /></div>
              <div><label style={S.label}>Email</label><input value={newStudentEmail} onChange={e => setNewStudentEmail(e.target.value)} placeholder="nikolai@example.com" type="email" style={S.input} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div><label style={S.label}>Language</label><select value={newStudentLang} onChange={e => setNewStudentLang(e.target.value)} style={S.input}><option value="en">English</option><option value="fr">French</option><option value="ru">Russian</option><option value="es">Spanish</option><option value="yi">Yiddish</option></select></div>
                <div><label style={S.label}>Goals</label><input value={newStudentGoals} onChange={e => setNewStudentGoals(e.target.value)} placeholder="Torah reading, conversation..." style={S.input} /></div>
              </div>
              <button onClick={handleRegister} disabled={loading || !newStudentName || !newStudentEmail}
                style={{ padding: '14px', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700,
                  background: (!newStudentName || !newStudentEmail) ? '#E5E5E0' : 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
                  color: (!newStudentName || !newStudentEmail) ? '#9CA3AF' : 'white', cursor: (!newStudentName || !newStudentEmail) ? 'not-allowed' : 'pointer' }}>
                {loading ? '⏳...' : '👤 Register Student'}
              </button>
              {registerResult && <div style={{ padding: '12px 16px', background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: '12px', color: '#065F46', fontSize: '14px', fontWeight: 600 }}>{registerResult}</div>}
            </div>
          </div>
        )}

        {/* ═══════════════ HISTORY ═══════════════ */}
        {activeTab === 'history' && (
          <div>
            <select value={selectedStudent} onChange={e => { setSelectedStudent(e.target.value); const s = students.find(s => s.user_id === e.target.value); if (s) loadHistory(s.student_name) }} style={{...S.input, marginBottom: '16px'}}>
              <option value="">-- Select student --</option>
              {students.map(s => <option key={s.user_id} value={s.user_id}>{s.student_name}</option>)}
            </select>
            {lessons.length === 0 ? <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>{selectedStudent ? 'No lessons.' : 'Select a student.'}</div> :
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lessons.map(lesson => (
                  <div key={lesson.id} style={S.card}>
                    <div style={{ fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>Lesson {lesson.lesson_number} • {lesson.lesson_date}{lesson.topic_title && <span style={{ fontWeight: 500, color: '#6B7280' }}> — {lesson.topic_title}</span>}</div>
                    {lesson.summary && <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px' }}>{lesson.summary.substring(0, 200)}...</p>}
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{lesson.vocabulary?.length || 0} words</div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {/* ═══════════════ PROMPT TAB ═══════════════ */}
        {activeTab === 'prompt' && (
          <div>
            <div style={S.card}>
              <div style={S.sectionTitle}>🤖 AI Prompt for Lesson Analysis</div>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', lineHeight: 1.6 }}>
                Copy this prompt into Claude or ChatGPT along with your lesson transcript. Replace [BRACKETED] placeholders with real data. The AI returns JSON you paste into the Import tab.
              </p>
              <div style={{ position: 'relative' }}>
                <textarea value={PROMPT_TEXT} readOnly rows={20} style={{...S.input, fontFamily: "'Courier New', monospace", fontSize: '11px', lineHeight: '1.6', resize: 'vertical', background: '#F5F5F3'}} />
                <button onClick={() => { navigator.clipboard.writeText(PROMPT_TEXT); alert('Copied!') }}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  📋 Copy Prompt
                </button>
              </div>
            </div>
            <div style={S.card}>
              <div style={S.sectionTitle}>📋 What the AI generates</div>
              <div style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.8 }}>
                The expanded prompt generates a complete lesson package:<br/>
                • <strong>vocabulary</strong> — All words with nikud, transliteration, translation, category (15-40 items)<br/>
                • <strong>conversation_practice</strong> — Main roleplay scenario from the lesson<br/>
                • <strong>additional_scenarios</strong> — Extra practice scenarios based on lesson themes<br/>
                • <strong>grammar_points</strong> — Patterns taught with Hebrew examples<br/>
                • <strong>cultural_notes</strong> — Israeli cultural context<br/>
                • <strong>homework</strong> — Practice tasks for between lessons<br/>
                • <strong>analysis</strong> — Struggles, strengths, recommendations, talk ratio, Hebrew %
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
