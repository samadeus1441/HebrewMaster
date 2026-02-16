// app/api/send-lesson-ready/route.ts
// ═══════════════════════════════════════════════════════════
// SEND LESSON READY EMAIL
// Called after successful JSON import in admin page
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { lessonReadyEmail } from '@/lib/emails'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM_EMAIL = process.env.EMAIL_FROM || 'Jacob from The Jerusalem Bridge <onboarding@resend.dev>'

export async function POST(req: NextRequest) {
  try {
    const { 
      student_user_id,
      student_name,
      student_email: providedEmail,
      lesson_number,
      topic_title,
      word_count,
      scenario_count,
      homework_items
    } = await req.json()

    if (!student_name) {
      return NextResponse.json({ error: 'Student name required' }, { status: 400 })
    }

    // Get email — either provided directly or looked up from Supabase auth
    let student_email = providedEmail
    if (!student_email && student_user_id) {
      const { data: { user } } = await supabase.auth.admin.getUserById(student_user_id)
      student_email = user?.email
    }

    if (!student_email) {
      return NextResponse.json({ error: 'Could not find student email' }, { status: 400 })
    }

    if (!resend) {
      return NextResponse.json({ 
        success: false, 
        error: 'RESEND_API_KEY not configured. Add it to Vercel env vars.' 
      }, { status: 500 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lashon.online'
    const dashboardUrl = `${siteUrl}/dashboard`

    const { subject, html } = lessonReadyEmail({
      studentName: student_name,
      lessonNumber: lesson_number || '?',
      topicTitle: topic_title || 'New Lesson',
      wordCount: word_count || 0,
      scenarioCount: scenario_count || 0,
      dashboardUrl,
      homeworkItems: homework_items,
    })

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [student_email],
      subject,
      html,
    })

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Lesson ready email sent to ${student_email}` })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
