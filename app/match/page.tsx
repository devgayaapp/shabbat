'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Profile {
  id: string
  name: string
  age: number
  gender: string
  bio: string
  profile_pic_url: string
}

export default function Match() {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matchModal, setMatchModal] = useState<{ show: boolean, name: string, phone: string } | null>(null)

  useEffect(() => {
    fetchNextProfile()
  }, [])

  const fetchNextProfile = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user logged in')

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('preferred_genders')
        .eq('user_id', user.id)
        .single()

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .in('gender', userProfile.preferred_genders.split(','))
        .not('id', 'in', (supabase
          .from('matches')
          .select('target_user_id')
          .eq('user_id', user.id)))
        .limit(1)

      if (error) throw error

      setCurrentProfile(profiles[0] || null)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChoice = async (isInterested: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !currentProfile) return

      const { data: existingMatch, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', currentProfile.id)
        .eq('target_user_id', user.id)
        .single()

      if (matchError && matchError.code !== 'PGRST116') throw matchError

      if (existingMatch && existingMatch.is_interested && isInterested) {
        // It's a match!
        const { data: matchedProfile } = await supabase
          .from('profiles')
          .select('name, phone')
          .eq('user_id', currentProfile.id)
          .single()

        setMatchModal({ show: true, name: matchedProfile.name, phone: matchedProfile.phone })
      }

      const { error } = await supabase
        .from('matches')
        .upsert({
          user_id: user.id,
          target_user_id: currentProfile.id,
          is_interested: isInterested
        })

      if (error) throw error

      fetchNextProfile()
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!currentProfile) return <div>No more profiles to show</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Find Your Match</h2>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <img src={currentProfile.profile_pic_url} alt={currentProfile.name} className="w-full h-64 object-cover rounded-lg" />
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentProfile.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentProfile.age}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentProfile.gender}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentProfile.bio}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleChoice(false)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            No
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Yes
          </button>
        </div>
      </div>
      {matchModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      It's a Match!
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You've matched with {matchModal.name}! Here's their phone number: {matchModal.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setMatchModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

