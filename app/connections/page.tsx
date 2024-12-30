'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Menu } from "lucide-react";

// Mock data for development
const MOCK_RECEIVED_REQUESTS = [
  {
    id: 1,
    name: 'David Cohen',
    age: 30,
    location: 'Tel Aviv',
    denomination: 'Modern Orthodox',
    about: 'Software engineer who loves to travel and explore new cultures.',
    compatibility: 88,
    profilePicture: '/profiles/david.jpeg',
    requestedAt: '2024-02-10T10:30:00Z',
  },
  {
    id: 2,
    name: 'Michael Levy',
    age: 28,
    location: 'Jerusalem',
    denomination: 'Orthodox',
    about: 'Medical resident with a passion for helping others.',
    compatibility: 82,
    profilePicture: '/profiles/michael.jpeg',
    requestedAt: '2024-02-09T15:45:00Z',
  },
];

const MOCK_SENT_REQUESTS = [
  {
    id: 1,
    name: 'Sarah Cohen',
    age: 28,
    location: 'Tel Aviv',
    denomination: 'Modern Orthodox',
    about: 'I love reading, hiking, and cooking Shabbat meals for friends and family.',
    compatibility: 85,
    profilePicture: '/profiles/sarah.jpeg',
    requestedAt: '2024-02-10T14:20:00Z',
    status: 'pending',
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
    requestedAt: '2024-02-08T09:15:00Z',
    status: 'accepted',
  },
];

export default function Connections() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState(MOCK_RECEIVED_REQUESTS);
  const [sentRequests, setSentRequests] = useState(MOCK_SENT_REQUESTS);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleAccept = async (id: number) => {
    setProcessingId(id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Remove from received requests
    setReceivedRequests(prev => prev.filter(req => req.id !== id));
    setProcessingId(null);
  };

  const handleDecline = async (id: number) => {
    setProcessingId(id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Remove from received requests
    setReceivedRequests(prev => prev.filter(req => req.id !== id));
    setProcessingId(null);
  };

  const handleCancel = async (id: number) => {
    setProcessingId(id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Remove from sent requests
    setSentRequests(prev => prev.filter(req => req.id !== id));
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <header className="py-4 md:py-6 sticky top-0 bg-gradient-to-b from-blue-50 to-white/95 backdrop-blur-sm z-10">
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
              <Link href="/matches">
                <Button variant="outline" size="sm">Find Matches</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            </div>
          </nav>

          {/* Mobile navigation menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 py-2 space-y-2 absolute left-0 right-0 px-4 bg-white/95 shadow-lg backdrop-blur-sm">
              <Link href="/matches" className="block">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  Find Matches
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
            <h1 className="text-2xl md:text-4xl font-bold mb-6">Your Connections</h1>
            
            <Tabs defaultValue="received" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 sticky top-[72px] bg-white/95 backdrop-blur-sm z-10">
                <TabsTrigger value="received">
                  Received ({receivedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="sent">
                  Sent ({sentRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="received">
                <div className="space-y-4">
                  {receivedRequests.map((request) => (
                    <Card key={request.id} className="bg-white overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-72 sm:h-auto">
                          <Image
                            src={request.profilePicture}
                            alt={`${request.name}'s profile picture`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 192px"
                            priority
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <CardHeader className="pb-2 flex-grow">
                            <div className="flex flex-col gap-2">
                              <div>
                                <CardTitle className="text-xl">{request.name}</CardTitle>
                                <CardDescription>
                                  {request.age} • {request.location} • {request.denomination}
                                </CardDescription>
                              </div>
                              <div className="text-sm text-gray-500">
                                Requested {formatDate(request.requestedAt)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <p className="text-gray-600 text-sm">{request.about}</p>
                          </CardContent>
                          <CardFooter className="flex justify-end space-x-2 mt-auto">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDecline(request.id)}
                              disabled={processingId === request.id}
                              className="flex-1 sm:flex-none"
                            >
                              {processingId === request.id ? 'Declining...' : 'Decline'}
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAccept(request.id)}
                              disabled={processingId === request.id}
                              className="flex-1 sm:flex-none"
                            >
                              {processingId === request.id ? 'Accepting...' : 'Accept'}
                            </Button>
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {receivedRequests.length === 0 && (
                    <div className="text-center py-8">
                      <h2 className="text-xl font-semibold text-gray-900">No Connection Requests</h2>
                      <p className="mt-2 text-gray-600 text-sm">
                        When someone sends you a connection request, it will appear here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="sent">
                <div className="space-y-4">
                  {sentRequests.map((request) => (
                    <Card key={request.id} className="bg-white overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-72 sm:h-auto">
                          <Image
                            src={request.profilePicture}
                            alt={`${request.name}'s profile picture`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 192px"
                            priority
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <CardHeader className="pb-2 flex-grow">
                            <div className="flex flex-col gap-2">
                              <div>
                                <CardTitle className="text-xl">{request.name}</CardTitle>
                                <CardDescription>
                                  {request.age} • {request.location} • {request.denomination}
                                </CardDescription>
                              </div>
                              <div className="text-sm text-gray-500">
                                Sent {formatDate(request.requestedAt)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <p className="text-gray-600 text-sm">{request.about}</p>
                          </CardContent>
                          <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-auto">
                            <div className={`text-sm font-medium text-center sm:text-left ${
                              request.status === 'accepted' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {request.status === 'accepted' ? 'Request Accepted ✓' : 'Pending Response...'}
                            </div>
                            {request.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                                onClick={() => handleCancel(request.id)}
                                disabled={processingId === request.id}
                              >
                                {processingId === request.id ? 'Canceling...' : 'Cancel Request'}
                              </Button>
                            )}
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {sentRequests.length === 0 && (
                    <div className="text-center py-8">
                      <h2 className="text-xl font-semibold text-gray-900">No Sent Requests</h2>
                      <p className="mt-2 text-gray-600 text-sm">
                        When you send connection requests, they will appear here
                      </p>
                      <Link href="/matches" className="mt-4 inline-block">
                        <Button size="sm">Find Matches</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
} 