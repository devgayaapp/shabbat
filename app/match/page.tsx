'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'

interface Profile {
  id: string
  user_id: string
  name: string
  age: number
  gender: string
  preferred_genders: string
  bio: string
  profile_pic_url: string
}

interface Match {
  id: string
  user_id: string
  target_user_id: string
  status: 'pending' | 'accepted' | 'rejected'
}

export default function MatchPage() {
  const [potentialMatches, setPotentialMatches] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error('No user logged in')

        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        if (profileError) throw profileError
        if (!userProfile) throw new Error('No profile found')

        const preferredGenders = userProfile.preferred_genders?.split(',') || []
        if (preferredGenders.length === 0) {
          setPotentialMatches([])
          setLoading(false)
          return
        }

        const { data: matches, error: matchError } = await supabase
          .from('profiles')
          .select('*')
          .neq('user_id', user.id)
          .in('gender', preferredGenders)
          .not('id', 'in', supabase
            .from('matches')
            .select('target_user_id')
            .eq('user_id', user.id));

        if (matchError) throw matchError
        setPotentialMatches(matches || [])
      } catch (err) {
        console.error('Error fetching matches:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch matches')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <p>Loading potential matches...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Shabbat Matches
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </nav>
        </header>

        <main className="py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Find Your Match</h1>
            
            {potentialMatches.length > 0 ? (
              <div className="space-y-6">
                {potentialMatches.map((match) => (
                  <Card key={match.id} className="bg-white">
                    <div className="sm:flex">
                      <div className="relative w-full sm:w-48 h-64 sm:h-auto">
                        {match.profile_pic_url ? (
                          <Image
                            src={match.profile_pic_url}
                            alt={`${match.name}'s profile picture`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 192px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">No photo</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardHeader>
                          <CardTitle className="text-2xl">{match.name}</CardTitle>
                          <CardDescription>
                            {match.age} • {match.gender}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{match.bio}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                          <Button variant="outline">Pass</Button>
                          <Button>Connect</Button>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900">No Matches Found</h2>
                <p className="mt-2 text-gray-600">
                  Update your preferences to see more matches
                </p>
                <Link href="/profile" className="mt-4 inline-block">
                  <Button>Update Profile</Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

