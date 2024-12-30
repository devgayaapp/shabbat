import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">
              Shabbat Matches
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
              Find Your Perfect <span className="text-blue-600">Jewish Match</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join our community of Jewish singles looking for meaningful relationships. Start your journey to find your bashert today.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

