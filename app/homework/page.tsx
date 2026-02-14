'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { CheckCircle2, Clock, BookOpen, ChevronRight } from 'lucide-react'

type Homework = {
  id: string
  title: string
  description: string | null
  type: string
  due_date: string | null
  completed_at: string | null
  score: number | null
  feedback: string | null
  content: any
  lesson_id: string | null
  created_at: string
}

export default function HomeworkPage() {
  const [homework, setHomework] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const [supabase] = useState(() =>
    createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  )

  useEffect(() => { loadHomework() }, [])

  const loadHomework = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('homework')
      .select('*')
      .eq('student_user_id', user.id)
      .order('created_at', { ascending: false })
    setHomework(data || [])
    setLoading(false)
  }

  const filtered = homework.filter(h => {
    if (filter === 'pending') return !h.completed_at
    if (filter === 'completed') return !!h.completed_at
    return true
  })

  const pending = homework.filter(h => !h.completed_at)
  const completed = homework.filter(h => !!h.completed_at)

  const typeIcons: Record<string, string> = {
    practice: '🃏',
    reading: '📖',
    writing: '✍️',
    quiz: '🎯',
    conversation: '💬',
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  if (loading) return <div className="flex items-center justify-center h-64 text-[#6b7280]">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#001B4D]">Homework</h1>
        <p className="text-[#6b7280] mt-1">Your assignments between lessons — complete them to get the most from your tutoring sessions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#e5e2db] p-4 text-center">
          <p className="text-3xl font-bold text-[#001B4D]">{homework.length}</p>
          <p className="text-xs text-[#6b7280] mt-1">Total</p>
        </div>
        <div className="bg-white border border-[#e5e2db] p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{pending.length}</p>
          <p className="text-xs text-[#6b7280] mt-1">Pending</p>
        </div>
        <div className="bg-white border border-[#e5e2db] p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{completed.length}</p>
          <p className="text-xs text-[#6b7280] mt-1">Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-semibold border transition capitalize ${
              filter === f
                ? 'bg-[#001B4D] text-white border-[#001B4D]'
                : 'border-[#e5e2db] text-[#6b7280] hover:border-[#CFBA8C]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Homework List */}
      {filtered.length === 0 ? (
        <div className="bg-[#FBF3D4] border border-[#CFBA8C]/30 p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-[#CFBA8C] mb-4" />
          <h3 className="text-lg font-serif text-[#001B4D] mb-2">
            {filter === 'pending' ? 'All caught up!' : filter === 'completed' ? 'No completed homework yet' : 'No homework yet'}
          </h3>
          <p className="text-sm text-[#6b7280]">
            {filter === 'all' ? 'Your tutor will assign homework after your lessons. Practice between sessions to improve faster!' : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(h => (
            <div key={h.id} className={`bg-white border p-5 transition hover:shadow-md ${
              h.completed_at ? 'border-emerald-200 bg-emerald-50/30' : 'border-[#e5e2db]'
            }`}>
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">{typeIcons[h.type] || '📋'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#001B4D]">{h.title}</h3>
                    {h.completed_at && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  {h.description && <p className="text-sm text-[#6b7280] mt-1">{h.description}</p>}
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#6b7280]">
                    <span className="capitalize px-2 py-0.5 bg-[#001B4D]/5 rounded">{h.type}</span>
                    {h.due_date && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due {formatDate(h.due_date)}
                      </span>
                    )}
                    {h.score !== null && (
                      <span className="font-bold text-emerald-600">Score: {h.score}%</span>
                    )}
                  </div>
                  {h.feedback && (
                    <div className="mt-3 p-3 bg-[#FBF3D4] border border-[#CFBA8C]/20 text-sm text-[#4a4a4a]">
                      <span className="font-semibold text-[#001B4D]">Tutor feedback:</span> {h.feedback}
                    </div>
                  )}
                </div>
                {!h.completed_at && h.type === 'practice' && (
                  <Link
                    href="/dashboard/practice"
                    className="px-4 py-2 bg-[#001B4D] text-white text-sm font-semibold hover:bg-[#002b7a] transition no-underline inline-flex items-center gap-1"
                  >
                    Start <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
                {!h.completed_at && h.type === 'reading' && (
                  <Link
                    href="/dashboard/reading"
                    className="px-4 py-2 bg-[#001B4D] text-white text-sm font-semibold hover:bg-[#002b7a] transition no-underline inline-flex items-center gap-1"
                  >
                    Read <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
                {!h.completed_at && h.type === 'quiz' && h.lesson_id && (
                  <Link
                    href={`/dashboard/quiz?lesson=${h.lesson_id}`}
                    className="px-4 py-2 bg-[#001B4D] text-white text-sm font-semibold hover:bg-[#002b7a] transition no-underline inline-flex items-center gap-1"
                  >
                    Quiz <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
