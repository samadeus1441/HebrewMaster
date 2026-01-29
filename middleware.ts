// ... imports and setup

const { data: { user } } = await supabase.auth.getUser()

// 1. Protect Dashboard: If NOT logged in, go to Login
if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
  return NextResponse.redirect(new URL('/login', request.url))
}

// 2. Redirect ONLY from Login page if already logged in
// (We removed the '/' check so the Home Page is now accessible)
if (user && request.nextUrl.pathname === '/login') {
  return NextResponse.redirect(new URL('/dashboard', request.url))
}

return response
}
// ... config