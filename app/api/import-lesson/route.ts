import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// 1. Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // 2. Initialize Resend INSIDE the function so it doesn't crash the build
    const resend = new Resend(process.env.RESEND_API_KEY)

    const body = await req.json()

    const {
      student_user_id,
      student_name,
      student_email,
      lesson_number,
      lesson_date,
      topic_title,
      summary,
      vocabulary,
      analysis,
      conversation_practice,
      additional_scenarios,
      grammar_points,
      cultural_notes,
      homework,
    } = body

    // Validation
    if (!student_user_id || !student_name || !lesson_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Import Lesson via RPC
    const { data: lessonId, error: lessonError } = await supabase.rpc('import_lesson_data', {
      p_student_user_id: student_user_id,
      p_student_name: student_name,
      p_lesson_number: lesson_number,
      p_lesson_date: lesson_date || new Date().toISOString().split('T')[0],
      p_summary: summary || '',
      p_vocabulary: vocabulary || [],
      p_analysis: analysis || {}
    })

    if (lessonError) throw lessonError

    // Update extended fields
    if (lessonId) {
      const updatePayload: Record<string, any> = {}
      if (topic_title) updatePayload.topic_title = topic_title
      if (grammar_points?.length) updatePayload.grammar_points = grammar_points
      if (cultural_notes?.length) updatePayload.cultural_notes = cultural_notes
      if (homework?.length) updatePayload.homework = homework

      if (Object.keys(updatePayload).length > 0) {
        await supabase.from('lessons').update(updatePayload).eq('id', lessonId)
      }
    }

    // Import Scenarios
    let scenariosCreated = 0
    if (conversation_practice?.dialogue) {
      await supabase.from('conversation_scenarios').insert({
        student_id: student_user_id,
        lesson_id: lessonId,
        title: conversation_practice.title || `Scenario Lesson ${lesson_number}`,
        context: conversation_practice.context || '',
        dialogue: conversation_practice.dialogue
      })
      scenariosCreated++
    }

    if (additional_scenarios?.length) {
      for (const scenario of additional_scenarios) {
        if (scenario.dialogue?.length) {
          await supabase.from('conversation_scenarios').insert({
            student_id: student_user_id,
            lesson_id: lessonId,
            title: scenario.title || `Extra Scenario Lesson ${lesson_number}`,
            context: scenario.context || '',
            dialogue: scenario.dialogue
          })
          scenariosCreated++
        }
      }
    }

    // --- EMAIL LOGIC ---
    let emailStatus = 'skipped'
    if (student_email) {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev', // Must use this until domain verification
          to: student_email, // Must be YOUR email for testing
          subject: `Lesson Ready: ${topic_title || 'Hebrew Practice'} ⚽`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h1>Hey ${student_name}!</h1>
              <p>Your summary for <strong>Lesson ${lesson_number}</strong> is ready.</p>
              <br/>
              <a href="https://hebrew-master-delta.vercel.app/dashboard" 
                 style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                 Go to Dashboard
              </a>
            </div>
          `
        })
        emailStatus = 'sent'
      } catch (emailError) {
        console.error('Resend Error:', emailError)
        emailStatus = 'failed'
      }
    }

    return NextResponse.json({
      success: true,
      lesson_id: lessonId,
      email_status: emailStatus
    })

  } catch (err: any) {
    console.error('Import error:', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('id, user_id, student_name')
      .order('student_name')
    
    if (error) throw error
    return NextResponse.json({ students: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// 3. THE MAGIC LINE: Forces this route to be dynamic, fixing the build error
export const dynamic = 'force-dynamic'