import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Use service role key for admin operations
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
      lesson_number,
      lesson_date,
      summary,
      vocabulary,
      analysis,
      conversation_practice // <--- שדה חדש מהפרומפט
    } = body

    // 1. Validate
    if (!student_user_id || !student_name || !lesson_number) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 2. Import Lesson & Vocabulary (Existing logic)
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

    // 3. Import Conversation Scenario (NEW LOGIC)
    let scenarioCreated = false
    if (conversation_practice && conversation_practice.dialogue) {
      const { error: scenarioError } = await supabase
        .from('conversation_scenarios')
        .insert({
          student_id: student_user_id,
          lesson_id: lessonId, // מקשרים לשיעור שנוצר
          title: conversation_practice.title || `Scenario Lesson ${lesson_number}`,
          context: conversation_practice.context || '',
          dialogue: conversation_practice.dialogue // שומרים את ה-JSON המלא
        })

      if (scenarioError) {
        console.error('Scenario import error:', scenarioError)
        // לא עוצרים את הריצה, רק מדפיסים שגיאה
      } else {
        scenarioCreated = true
      }
    }

    return NextResponse.json({
      success: true,
      lesson_id: lessonId,
      cards_created: vocabulary?.length || 0,
      scenario_created: scenarioCreated,
      message: `Lesson ${lesson_number} imported. ${vocabulary?.length || 0} words, Scenario: ${scenarioCreated ? 'Yes' : 'No'}`
    })

  } catch (err: any) {
    console.error('Import error:', err)
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    )
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