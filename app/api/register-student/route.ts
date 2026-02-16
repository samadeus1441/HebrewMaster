// app/api/register-student/route.ts
// ═══════════════════════════════════════════════════════════
// REGISTER STUDENT — Creates Supabase auth + profile + sends welcome email
// Called from Admin page when Jack registers a new student
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { welcomeEmail } from '@/lib/emails'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Resend setup — will gracefully skip if no API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Use custom domain if verified, otherwise fallback to Resend default
const FROM_EMAIL = process.env.EMAIL_FROM || 'Jacob from The Jerusalem Bridge <onboarding@resend.dev>'

export async function POST(req: NextRequest) {
  try {
    const { 
      email, 
      student_name, 
      native_language, 
      learning_goals,
      target_language,  // 'Modern Hebrew' | 'Biblical Hebrew' | 'Yiddish' | 'Aramaic'
      send_welcome_email  // boolean — default true
    } = await req.json()

    if (!email || !student_name) {
      return NextResponse.json(
        { error: 'Email and student name are required' },
        { status: 400 }
      )
    }

    const language = target_language || 'Modern Hebrew'
    const shouldSendEmail = send_welcome_email !== false // default true
    
    // ── Step 1: Create auth user ──
    const tempPassword = `Lashon2026_${Math.random().toString(36).slice(2, 10)}`
    
    let userId: string

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true
    })

    if (authError) {
      // User already exists — find and link
      if (authError.message.includes('already') || authError.message.includes('exists')) {
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const existingUser = users?.find(u => u.email === email)
        
        if (existingUser) {
          userId = existingUser.id
          
          await supabase
            .from('student_profiles')
            .upsert({
              user_id: existingUser.id,
              student_name,
              native_language: native_language || 'en',
              learning_goals: learning_goals || '',
              target_language: language,
              current_level: 'beginner'
            }, { onConflict: 'user_id' })

          return NextResponse.json({
            success: true,
            message: `Linked existing user ${email} to student profile ${student_name}`,
            user_id: existingUser.id,
            email_sent: false,
            note: 'User already existed — no welcome email sent. Use Send Welcome Email button if needed.'
          })
        }
      }
      
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    userId = authData.user.id

    // ── Step 2: Create student profile ──
    const { error: profileError } = await supabase
      .from('student_profiles')
      .insert({
        user_id: userId,
        student_name,
        native_language: native_language || 'en',
        learning_goals: learning_goals || '',
        target_language: language,
        current_level: 'beginner'
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't fail — user was created, profile can be retried
    }

    // ── Step 3: Create profile + stats entries ──
    await supabase
      .from('profiles')
      .upsert({ id: userId, xp: 0 }, { onConflict: 'id' })

    await supabase
      .from('user_stats')
      .upsert({ 
        user_id: userId, 
        total_xp: 0, 
        current_streak: 0, 
        words_learned: 0 
      }, { onConflict: 'user_id' })

    // ── Step 4: Send welcome email ──
    let emailSent = false
    let emailError = null

    if (shouldSendEmail && resend) {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lashon.online'
        const dashboardUrl = `${siteUrl}/dashboard`

        const { subject, html } = welcomeEmail({
          studentName: student_name,
          email,
          tempPassword,
          language,
          dashboardUrl,
        })

        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: [email],
          subject,
          html,
        })

        if (error) {
          emailError = error
          console.error('Welcome email error:', error)
        } else {
          emailSent = true
        }
      } catch (e: any) {
        emailError = e.message
        console.error('Email send failed:', e)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Student ${student_name} registered successfully!`,
      user_id: userId,
      temp_password: tempPassword,
      email_sent: emailSent,
      email_error: emailError,
      note: emailSent 
        ? `Welcome email sent to ${email}` 
        : resend 
          ? `Account created but email failed: ${emailError}. Share password manually.`
          : 'No RESEND_API_KEY configured — share login details with student manually.'
    })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
