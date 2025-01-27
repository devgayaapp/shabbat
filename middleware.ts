import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of paths that require authentication
const PROTECTED_PATHS = [
  '/matches',
  '/profile',
  '/settings',
  '/connections',
  '/match'
]

// List of paths that are only accessible when NOT authenticated
const AUTH_PATHS = [
  '/login',
  '/signup',
  '/auth'
]

export async function middleware(request: NextRequest) {
  try {
    // Create a response and a Supabase client
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Refresh the session if it exists
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const path = request.nextUrl.pathname

    // If the path requires authentication and there's no session,
    // redirect to login
    if (PROTECTED_PATHS.some(protectedPath => path.startsWith(protectedPath)) && !session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }

    // If we're on an auth path and have a session,
    // redirect to matches
    if (AUTH_PATHS.some(authPath => path.startsWith(authPath)) && session) {
      return NextResponse.redirect(new URL('/matches', request.url))
    }

    return res
  } catch (e) {
    // If there's an error, redirect to login
    console.error('Middleware error:', e)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}