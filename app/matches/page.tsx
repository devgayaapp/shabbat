'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/protected-route';
import { useUser } from '@/contexts/UserContext';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: string;
  preferred_genders: string;
  bio: string;
  profile_pic_url: string;
}

export default function MatchesPage() {
  const { user, profile } = useUser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      loadProfiles();
    }
  }, [user, profile]);

  const loadProfiles = async () => {
    try {
      // Get profiles that match the user's preferences
      const { data, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user!.id) // Exclude current user
        .eq('gender', profile!.preferred_genders) // Match user's gender preference
        .eq('preferred_genders', profile!.gender); // Match profiles that prefer user's gender

      if (profilesError) throw profilesError;

      // Filter out profiles that already have connections
      const { data: connections, error: connectionsError } = await supabase
        .from('connections')
        .select('target_user_id')
        .eq('user_id', user!.id);

      if (connectionsError) throw connectionsError;

      const connectedUserIds = connections.map(c => c.target_user_id);
      const availableProfiles = data.filter(p => !connectedUserIds.includes(p.user_id));

      setProfiles(availableProfiles);
    } catch (err) {
      console.error('Error loading profiles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (profileId: string) => {
    try {
      console.log('Attempting to connect with profile:', profileId);
      console.log('Current user:', user?.id);
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Find the target profile to get its user_id
      const targetProfile = profiles.find(p => p.id === profileId);
      if (!targetProfile) {
        throw new Error('Target profile not found');
      }

      const connection = {
        user_id: user.id,
        target_user_id: targetProfile.user_id, // Use user_id instead of profile.id
        status: 'pending',
        created_at: new Date().toISOString()
      };
      console.log('Connection payload:', connection);

      const { error: connectionError, data } = await supabase
        .from('connections')
        .insert([connection])
        .select();

      if (connectionError) {
        console.error('Supabase error details:', connectionError);
        throw connectionError;
      }

      console.log('Connection created successfully:', data);
      setProfiles(profiles.filter(p => p.id !== profileId));
    } catch (err) {
      console.error('Error connecting:', err);
      console.error('Error details:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  const handlePass = (profileId: string) => {
    setProfiles(profiles.filter(p => p.id !== profileId));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="py-6">
            <h1 className="text-2xl font-bold text-amber-600">Your Matches</h1>
          </header>

          <main className="py-12">
            {loading ? (
              <div className="flex justify-center">
                <p>Loading profiles...</p>
              </div>
            ) : error ? (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Error</CardTitle>
                  <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </CardFooter>
              </Card>
            ) : profiles.length === 0 ? (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>No More Matches</CardTitle>
                  <CardDescription>
                    Check back later for new potential matches!
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <Card key={profile.id} className="overflow-hidden">
                    <div className="relative h-64 w-full">
                      <Image
                        src={profile.profile_pic_url || '/default-avatar.png'}
                        alt={profile.name}
                        fill
                        className={profile.profile_pic_url ? "object-cover" : "object-contain p-4"}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{profile.name}, {profile.age}</CardTitle>
                      <CardDescription>{profile.bio}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between gap-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handlePass(profile.id)}
                      >
                        Pass
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => handleConnect(profile.id)}
                      >
                        Connect
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}