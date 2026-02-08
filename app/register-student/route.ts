import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, student_name, native_language, learning_goals } = await req.json()

    if (!email || !student_name) {
      return NextResponse.json(
        { error: 'Email and student name are required' },
        { status: 400 }
      )
    }

    // Step 1: Create auth user with temporary password
    // Student will need to reset password or you send them a magic link
    const tempPassword = `Hebrew2026_${Math.random().toString(36).slice(2, 10)}`
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true // Skip email verification
    })

    if (authError) {
      // If user already exists, try to find them
      if (authError.message.includes('already') || authError.message.includes('exists')) {
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const existingUser = users?.find(u => u.email === email)
        
        if (existingUser) {
          // User exists - just create the profile
          const { error: profileError } = await supabase
            .from('student_profiles')
            .upsert({
              user_id: existingUser.id,
              student_name,
              native_language: native_language || 'en',
              learning_goals: learning_goals || '',
              current_level: 'beginner'
            }, { onConflict: 'user_id' })

          if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 500 })
          }

          return NextResponse.json({
            success: true,
            message: `Linked existing user ${email} to student profile ${student_name}`,
            user_id: existingUser.id
          })
        }
      }
      
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Step 2: Create student profile
    const userId = authData.user.id
    
    const { error: profileError } = await supabase
      .from('student_profiles')
      .insert({
        user_id: userId,
        student_name,
        native_language: native_language || 'en',
        learning_goals: learning_goals || '',
        current_level: 'beginner'
      })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Step 3: Create initial profile entry (for XP tracking)
    await supabase
      .from('profiles')
      .upsert({ id: userId, xp: 0 }, { onConflict: 'id' })

    // Step 4: Create user_stats entry
    await supabase
      .from('user_stats')
      .upsert({ 
        user_id: userId, 
        total_xp: 0, 
        current_streak: 0, 
        words_learned: 0 
      }, { onConflict: 'user_id' })

    return NextResponse.json({
      success: true,
      message: `Student ${student_name} created. Temp password: ${tempPassword}`,
      user_id: userId,
      temp_password: tempPassword // Show this once so Jack can share login with student
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
