import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // LOG 1: תחילת הבדיקה
  console.log('🔍 [Middleware Start] Path:', request.nextUrl.pathname)

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // LOG 2: האם יש משתמש?
  console.log('👤 [Auth Status] User ID:', user?.id || 'GUEST (No User)')

  // בדיקה 1: הגנה על הדשבורד
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    console.log('🚫 [BLOCK] No user on protected route. Redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // בדיקה 2: דף הבית או לוגין כשהמשתמש כבר מחובר
  if (user && request.nextUrl.pathname === '/login') {
    console.log('🔀 [REDIRECT] User logged in on login page. Sending to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // LOG 3: אם הגענו לפה, הכל עבר חלק
  console.log('✅ [PASS] No redirect triggered. Loading page...')
  
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}