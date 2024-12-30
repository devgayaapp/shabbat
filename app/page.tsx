import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF6E6] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-bold text-[#E6B94D]">
              Yaniv's Shabbat Matches
            </div>
            <div className="space-x-4">
              <Link href="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </nav>
        </header>

        <main className="py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Find Your <span className="text-[#E6B94D]">Bashert</span> Through Shabbat
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Welcome to Yaniv's Shabbat Matches - born from a decade-long tradition of bringing together over 300 Jewish and Israeli people every Friday night for Shabbat dinner.
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              With over 22 married couples (and many more dating!) who met at our Shabbat dinners, we're now bringing this warm community online to help more Jewish singles find their perfect match.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Join Our Community
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-[#E6B94D] mb-4">300+</div>
              <p className="text-gray-600">People gathering every Friday for Shabbat dinner</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-[#E6B94D] mb-4">10+ Years</div>
              <p className="text-gray-600">Of bringing the Jewish community together</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-[#E6B94D] mb-4">22+</div>
              <p className="text-gray-600">Married couples who met at our Shabbat dinners</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

