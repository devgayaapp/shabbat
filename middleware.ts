import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

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

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // If the path requires authentication and there's no session,
  // redirect to login
  if (PROTECTED_PATHS.some(protectedPath => path.startsWith(protectedPath)) && !session) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If we're on an auth path and have a session,
  // redirect to matches
  if (AUTH_PATHS.some(authPath => path.startsWith(authPath)) && session) {
    const redirectUrl = new URL('/matches', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 