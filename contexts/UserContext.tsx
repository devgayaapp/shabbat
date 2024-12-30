'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

interface Profile {
  id: string
  user_id: string
  name: string
  age: number
  gender: string
  preferred_genders: string
  bio: string
  profile_pic_url: string
  is_admin?: boolean
  created_at: string
  updated_at: string
}

interface UserContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  error: string | null
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        }
      } catch (err) {
        console.error('Error checking session:', err)
        setError(err instanceof Error ? err.message : 'Failed to check session')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true)
      try {
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (err) {
        console.error('Error handling auth change:', err)
        setError(err instanceof Error ? err.message : 'Failed to handle auth change')
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError) throw profileError
      setProfile(data)
      setError(null)
    } catch (err) {
      console.error('Error loading profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
      setProfile(null)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      setError(null)
    } catch (err) {
      console.error('Error signing out:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }

  return (
    <UserContext.Provider value={{ user, profile, isLoading, error, signOut }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

