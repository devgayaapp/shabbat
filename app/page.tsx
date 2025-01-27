'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useUser } from '@/contexts/UserContext'

const COUPLES = [
  {
    image: '/couples/3.jpeg',
    names: 'Leah & Jacob',
    date: 'Married February 2024',
    quote: 'Found our soulmate through Shabbat Matches!'
  },
  {
    image: '/couples/2.jpeg',
    names: 'Sarah & Michael',
    date: 'Married December 2023',
    quote: 'Our first Shabbat dinner together changed everything.'
  },
  {
    image: '/couples/4.jpg',
    names: 'Rachel & David',
    date: 'Married January 2024',
    quote: 'Forever grateful for this amazing community.'
  },
  {
    image: '/couples/5.jpg',
    names: 'Hannah & Daniel',
    date: 'Engaged November 2023',
    quote: 'From Shabbat dinner to forever.'
  },
  {
    image: '/couples/7.jpg',
    names: 'Rebecca & Joseph',
    date: 'Married March 2024',
    quote: 'Our perfect match was just one Shabbat away.'
  },
  {
    image: '/couples/8.jpg',
    names: 'Esther & Benjamin',
    date: 'Married January 2024',
    quote: 'Thank you for bringing us together!'
  }
]

export default function HomePage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6E6] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-4 sm:py-6">
          <nav className="flex flex-row justify-between items-center">
            <Link href="/" className="text-base sm:text-xl md:text-2xl font-bold text-[#E6B94D] whitespace-nowrap truncate max-w-[180px] sm:max-w-none">
              Shabbat Matches
            </Link>
            <div className="flex space-x-2 sm:space-x-4 shrink-0">
              {user ? (
                <Link href="/dashboard">
                  <Button className="px-3 sm:px-4">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="px-2 sm:px-4 text-sm sm:text-base">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="px-2 sm:px-4 text-sm sm:text-base">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        <main>
          {/* Updated hero content */}
          <div className="py-12 sm:py-20 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6B94D] mb-4 sm:mb-6 px-2">
              Find Your Jewish Match
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Join our community of Jewish singles looking for meaningful relationships. Start your journey to find your perfect match today.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
                Start Matching
              </Button>
            </Link>
          </div>

          {/* Success Stories */}
          <section className="py-20 bg-white/50 rounded-3xl mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#E6B94D] mb-4">Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real couples who found their perfect match through Shabbat Matches. Your story could be next!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
              {COUPLES.map((couple, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-96 overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={couple.image}
                      alt={`${couple.names} - A success story from Shabbat Matches`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="font-semibold text-lg">{couple.names}</p>
                      <p className="text-sm opacity-90 mb-2">{couple.date}</p>
                      <p className="text-sm italic opacity-75">{couple.quote}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="max-w-4xl mx-auto mt-20 px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-[#E6B94D]">300+</div>
                  <p className="mt-2 text-gray-600">Weekly Participants</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#E6B94D]">22+</div>
                  <p className="mt-2 text-gray-600">Married Couples</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#E6B94D]">10+</div>
                  <p className="mt-2 text-gray-600">Years of Matchmaking</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#E6B94D] mb-4">Jewish Values</h3>
                <p className="text-gray-600">
                  Connect with singles who share your commitment to Jewish traditions and values.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#E6B94D] mb-4">Meaningful Matches</h3>
                <p className="text-gray-600">
                  Our matching system focuses on compatibility and shared life goals.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#E6B94D] mb-4">Safe Community</h3>
                <p className="text-gray-600">
                  A trusted platform where Jewish singles can connect with confidence.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

