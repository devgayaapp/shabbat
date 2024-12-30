'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

// Mock data for development
const MOCK_MATCHES = [
  {
    id: 1,
    name: 'Sarah Cohen',
    age: 28,
    location: 'Tel Aviv',
    denomination: 'Modern Orthodox',
    about: 'I love reading, hiking, and cooking Shabbat meals for friends and family.',
    compatibility: 85,
    profilePicture: '/profiles/sarah.jpeg',
  },
  {
    id: 2,
    name: 'Rachel Levy',
    age: 26,
    location: 'Jerusalem',
    denomination: 'Orthodox',
    about: 'Teaching elementary school and passionate about Jewish education.',
    compatibility: 78,
    profilePicture: '/profiles/rachel.jpeg',
  },
  {
    id: 3,
    name: 'Leah Goldberg',
    age: 29,
    location: 'Haifa',
    denomination: 'Modern Orthodox',
    about: 'Software engineer by day, amateur chef by night. Love hosting Shabbat dinners.',
    compatibility: 72,
    profilePicture: '/profiles/leah.jpeg',
  },
];

export default function Matches() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [connectingId, setConnectingId] = useState<number | null>(null);
  const [connectedIds, setConnectedIds] = useState<number[]>([]);
  const [passedIds, setPassedIds] = useState<number[]>([]);

  const handleConnect = async (id: number) => {
    setConnectingId(id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setConnectedIds(prev => [...prev, id]);
    setConnectingId(null);
    // Redirect to connections page after a short delay
    setTimeout(() => {
      router.push('/connections');
    }, 1500);
  };

  const handlePass = async (id: number) => {
    setPassedIds(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <header className="py-4 md:py-6">
          <nav className="flex justify-between items-center">
            <Link href="/dashboard" className="text-xl md:text-2xl font-bold text-blue-600">
              Shabbat Matches
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/connections">
                <Button variant="outline" size="sm">Connections</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">Profile</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            </div>
          </nav>

          {/* Mobile navigation menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 py-2 space-y-2">
              <Link href="/connections" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Connections
                </Button>
              </Link>
              <Link href="/profile" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Profile
                </Button>
              </Link>
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          )}
        </header>

        <main className="py-6 md:py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Your Matches</h1>
            
            <div className="space-y-4 md:space-y-6">
              {MOCK_MATCHES.filter(match => !passedIds.includes(match.id)).map((match) => (
                <Card key={match.id} className="bg-white overflow-hidden">
                  <div className="sm:flex">
                    <div className="relative w-full sm:w-48 h-64 sm:h-auto">
                      <Image
                        src={match.profilePicture}
                        alt={`${match.name}'s profile picture`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 192px"
                        priority
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader className="pb-3 md:pb-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <CardTitle className="text-xl md:text-2xl">{match.name}</CardTitle>
                            <CardDescription className="text-sm md:text-base">
                              {match.age} • {match.location} • {match.denomination}
                            </CardDescription>
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium self-start">
                            {match.compatibility}% Match
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3 md:pb-6">
                        <p className="text-gray-600 text-sm md:text-base">{match.about}</p>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2">
                        {!connectedIds.includes(match.id) ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-sm"
                              onClick={() => handlePass(match.id)}
                              disabled={connectingId === match.id}
                            >
                              Pass
                            </Button>
                            <Button 
                              size="sm" 
                              className="text-sm min-w-[80px]"
                              onClick={() => handleConnect(match.id)}
                              disabled={connectingId === match.id}
                            >
                              {connectingId === match.id ? 'Connecting...' : 'Connect'}
                            </Button>
                          </>
                        ) : (
                          <div className="text-green-600 text-sm font-medium">
                            Connection Request Sent ✓
                          </div>
                        )}
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {(MOCK_MATCHES.length === 0 || MOCK_MATCHES.every(match => passedIds.includes(match.id))) && (
              <div className="text-center py-8 md:py-12">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">No More Matches</h2>
                <p className="mt-2 text-sm md:text-base text-gray-600">
                  Check back later for new matches
                </p>
                <Link href="/profile" className="mt-4 inline-block">
                  <Button size="sm">Update Profile</Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 