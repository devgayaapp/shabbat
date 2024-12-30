'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function DashboardPage() {
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
              <Link href="/matches">
                <Button variant="outline">Matches</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Exit</Button>
              </Link>
            </div>
          </nav>
        </header>

        <main className="py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Welcome to Shabbat Matches</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                <p className="text-gray-600 mb-4">Complete your profile to start matching with others.</p>
                <Link href="/profile">
                  <Button>Update Profile</Button>
                </Link>
              </div>

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