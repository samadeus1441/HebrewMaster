import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Initialize Supabase with Service Role (Admin)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      student_user_id,
      student_name,
      student_email, // <--- Added this so we know who to email
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

    // 1. Validate
    if (!student_user_id || !student_name || !lesson_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 2. Import Lesson & Vocabulary via RPC
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

    // 3. Update lesson with expanded fields
    if (lessonId) {
      const updatePayload: Record<string, any> = {}
      if (topic_title) updatePayload.topic_title = topic_title
      if (grammar_points && grammar_points.length > 0) updatePayload.grammar_points = grammar_points
      if (cultural_notes && cultural_notes.length > 0) updatePayload.cultural_notes = cultural_notes
      if (homework && homework.length > 0) updatePayload.homework = homework

      if (Object.keys(updatePayload).length > 0) {
        await supabase.from('lessons').update(updatePayload).eq('id', lessonId)
      }
    }

    // 4. Import Main Conversation Scenario
    let scenariosCreated = 0
    if (conversation_practice && conversation_practice.dialogue) {
      const { error: scenarioError } = await supabase
        .from('conversation_scenarios')
        .insert({
          student_id: student_user_id,
          lesson_id: lessonId,
          title: conversation_practice.title || `Scenario Lesson ${lesson_number}`,
          context: conversation_practice.context || '',
          dialogue: conversation_practice.dialogue
        })

      if (!scenarioError) scenariosCreated++
    }

    // 5. Import Additional Scenarios
    if (additional_scenarios && additional_scenarios.length > 0) {
      for (const scenario of additional_scenarios) {
        if (scenario.dialogue && scenario.dialogue.length > 0) {
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

    // --- EMAIL NOTIFICATION LOGIC ---
    let emailStatus = 'skipped'
    
    // Only attempt to send if we have an email address
    if (student_email) {
      try {
        await resend.emails.send({
          // IMPORTANT: Until you verify your domain in Resend, use 'onboarding@resend.dev'
          // Once verified, change this to: 'Yaacov <coach@yourdomain.com>'
          from: 'onboarding@resend.dev', 
          to: student_email,
          subject: `Lesson Ready: ${topic_title || 'Hebrew Practice'} ⚽`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h1>Hey ${student_name}!</h1>
              <p>Your summary for <strong>Lesson ${lesson_number}</strong> is ready.</p>
              <p>I've updated your dashboard with the new vocabulary and missions we discussed.</p>
              <br/>
              <a href="https://hebrew-master-delta.vercel.app/dashboard" 
                 style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                 Go to Dashboard
              </a>
              <br/><br/>
              <p>See you next time,<br/>Yaacov</p>
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
      cards_created: vocabulary?.length || 0,
      scenarios_created: scenariosCreated,
      email_status: emailStatus,
      message: `Lesson imported successfully. Email: ${emailStatus}`
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
      .select('id, user_id, student_name, native_language, current_level, created_at')
      .order('student_name')
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ students: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}