'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function Settings() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('No user logged in')

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('phone')
        .eq('user_id', user.id)
        .single()
      if (profileError) throw profileError

      setPhone(data.phone)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('No user logged in')

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ phone })
        .eq('user_id', user.id)
      if (updateError) throw updateError

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <nav className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              Shabbat Matches
            </Link>
          </nav>
        </header>

        <main className="py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Update your contact information
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 555-5555"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                {success && (
                  <p className="text-sm text-green-600">Settings updated successfully!</p>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}

