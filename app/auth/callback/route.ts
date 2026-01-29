import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // החלפת הקוד ב-Session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // אם הכל הצליח, שלח לדף היעד (בדרך כלל דשבורד)
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    // אם הייתה שגיאה בהחלפת הקוד, נדפיס אותה ללוג כדי שתראה בטרמינל
    console.error('Auth callback error:', error.message)
  }

  // במקרה של שגיאה או שאין קוד, חזרה ללוגין עם הסבר
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}