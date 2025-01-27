'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const router = useRouter();
  const { user, signOut } = useUser();

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('name, age, gender, preferred_genders, bio')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        // Check if all required fields are filled
        const isComplete = Boolean(
          data.name &&
          data.age &&
          data.gender &&
          data.preferred_genders &&
          data.bio
        );
        console.log(`Profile complete: ${isComplete}`);
        console.log(`name: ${data.name}, age: ${data.age}, gender: ${data.gender}, preferred_genders: ${data.preferred_genders}, bio: ${data.bio}`)
        setProfileComplete(isComplete);
      }
    };

    checkProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to logout from Shabbat Matches?</p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

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
              <Link href="/matches">
                <Button variant="outline">Matches</Button>
              </Link>
              <Button 
                variant="outline"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Exit
              </Button>
            </div>
          </nav>
        </header>

        <main className="py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Welcome to Shabbat Matches</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!profileComplete && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                  <p className="text-gray-600 mb-4">Complete your profile to start matching with others.</p>
                  <Link href="/profile">
                    <Button>Update Profile</Button>
                  </Link>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Your Matches</h2>
                <p className="text-gray-600 mb-4">View and connect with your matches.</p>
                <Link href="/matches">
                  <Button>View Matches</Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-gray-600">No recent activity to show.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}