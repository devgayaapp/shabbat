import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

if (!siteUrl) {
  throw new Error('Missing NEXT_PUBLIC_SITE_URL environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    cookieOptions: {
      domain: process.env.NODE_ENV === 'production' ? 'shabbat-matches.vercel.app' : 'localhost'
    }
  },
  global: {
    headers: {
      'x-site-url': siteUrl
    }
  }
})

