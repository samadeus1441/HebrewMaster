import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  // Protect dashboard routes — redirect to login if no user
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect onboarding route — redirect to login if no user
  if (request.nextUrl.pathname.startsWith('/onboarding') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in and goes to login, redirect to dashboard
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is logged in and goes to signup, redirect to dashboard
  if (user && request.nextUrl.pathname === '/signup') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check onboarding status for dashboard access
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      // If onboarding not completed, redirect to onboarding
      // (skip this check for admin page)
      if (profile && !profile.onboarding_completed && !request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    } catch {
      // If profile doesn't exist yet (race condition), let it through
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/onboarding'],
}
