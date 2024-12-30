'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

// Debug credentials
const DEBUG_EMAIL = 'test@test.com'
const DEBUG_PASSWORD = 'ASdasd123'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Debug bypass
    if (email === DEBUG_EMAIL && password === DEBUG_PASSWORD) {
      window.location.href = '/dashboard'
      return
    }

    try {
      // First check if user exists
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInData?.user) {
        // User exists and password is correct, redirect to dashboard
        window.location.href = '/dashboard'
        return
      }

      // If we get here, try to sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please try logging in instead.')
          setLoading(false)
          return
        }
        throw signUpError
      }

      if (data?.user) {
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Debug auto-fill function
  const fillDebugCredentials = () => {
    setEmail(DEBUG_EMAIL)
    setPassword(DEBUG_PASSWORD)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Shabbat Matches
            </Link>
            <div className="space-x-4">
              <Link href="/login">
                <Button variant="outline">Log In</Button>
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>
                Join our community and find your perfect match
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>
                {error && (
                  <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-100">
                    {error}
                    {error.includes('already registered') && (
                      <div className="mt-2">
                        <Link href="/login" className="text-blue-600 hover:underline">
                          Click here to log in
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                {/* Debug button - only visible in development */}
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={fillDebugCredentials}
                  >
                    Fill Test Credentials
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}

