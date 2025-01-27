'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import AuthLoading from './loading'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isLoading && !user) {
        router.push('/login')
      }
    }, 1000) // Add a small delay to prevent immediate redirects

    return () => clearTimeout(timeoutId)
  }, [user, isLoading, router])

  if (isLoading) {
    return <AuthLoading />
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}