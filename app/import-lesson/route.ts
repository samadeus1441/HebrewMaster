import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // NOT the anon key - needs admin access
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
      vocabulary,  // Array of {front, back, transliteration, category}
      analysis     // Free-form JSON with struggles, recommendations, etc.
    } = body

    // Validate required fields
    if (!student_user_id || !student_name || !lesson_number) {
      return NextResponse.json(
        { error: 'Missing required fields: student_user_id, student_name, lesson_number' },
        { status: 400 }
      )
    }

    // Call the import function we created in Supabase
    const { data, error } = await supabase.rpc('import_lesson_data', {
      p_student_user_id: student_user_id,
      p_student_name: student_name,
      p_lesson_number: lesson_number,
      p_lesson_date: lesson_date || new Date().toISOString().split('T')[0],
      p_summary: summary || '',
      p_vocabulary: vocabulary || [],
      p_analysis: analysis || {}
    })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      lesson_id: data,
      cards_created: vocabulary?.length || 0,
      message: `Lesson ${lesson_number} imported for ${student_name}. ${vocabulary?.length || 0} flashcards created.`
    })

  } catch (err: any) {
    console.error('Import error:', err)
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET: List all students for the admin dropdown
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('id, user_id, student_name, native_language, current_level, created_at')
      .order('student_name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ students: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
