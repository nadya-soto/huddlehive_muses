import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Heart, Search, Plus, Shield } from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Hidden Spaces
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/discover">
                <Button variant="ghost">Discover</Button>
              </Link>
              <Link to="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Perfect
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Hidden Space
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find welcoming, accessible community spaces where you can gather, learn, and connect. From quiet libraries
            to vibrant cafes, discover the perfect place for meaningful interactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discover">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Spaces Near You
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="lg" variant="outline">
                <Plus className="w-5 h-5 mr-2" />
                Add Your Space
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connecting Communities Through Spaces</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform bridges the gap between people seeking meaningful spaces and venues looking to serve their
              community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Location-Based Discovery</CardTitle>
                <CardDescription>
                  Find spaces near you with our intelligent location-based search and interactive mapping.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Accessibility First</CardTitle>
                <CardDescription>
                  Filter by accessibility features including step-free access, Braille options, and inclusive
                  facilities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Community Driven</CardTitle>
                <CardDescription>
                  Built by the community, for the community. Add, review, and manage spaces collaboratively.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Hidden Space?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community and start discovering amazing spaces in your area today.
          </p>
          <Link to="/discover">
            <Button size="lg" variant="secondary">
              Start Exploring
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Hidden Spaces</span>
          </div>
          <p className="text-gray-400">Cultivating community connections through accessible urban spaces.</p>
          <p className="text-gray-500 text-sm mt-4">Built for BCS Hackathon - Her Third Spaces Challenge</p>
        </div>
      </footer>
    </div>
  )
}
