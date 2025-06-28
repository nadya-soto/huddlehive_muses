"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Filter, Star, Users, Coffee, Book, TreePine, Utensils, Building, Home } from "lucide-react"
import { Link } from "react-router-dom"
import { spacesAPI } from "@/lib/api"

// Mock data for demonstration (until Flask backend is ready)
const mockSpaces = [
  {
    id: 1,
    name: "Central Community Library",
    category: "library",
    type: "commercial",
    address: "123 Main St, Downtown",
    rating: 4.8,
    distance: "0.3 miles",
    image: "/placeholder.svg?height=200&width=300",
    features: ["step_free", "braille", "quiet", "wifi", "accessible_restrooms"],
    description: "A welcoming library with extensive accessibility features and quiet study areas.",
  },
  {
    id: 2,
    name: "Sarah's Garden Studio",
    category: "other",
    type: "private",
    address: "456 Oak Ave, Midtown",
    rating: 4.6,
    distance: "0.7 miles",
    image: "/placeholder.svg?height=200&width=300",
    features: ["wifi", "outdoor_seating", "accessible_restrooms", "calm_spaces"],
    description: "A beautiful private garden studio space perfect for small workshops and creative gatherings.",
  },
]

const accessibilityFeatures = [
  { id: "accessible_restrooms", label: "Accessible Restrooms", icon: "🚻" },
  { id: "step_free", label: "Step-Free Access", icon: "♿" },
  { id: "braille", label: "Braille Options", icon: "⠃" },
  { id: "calm_spaces", label: "Calm Spaces", icon: "🧘" },
  { id: "wifi", label: "Free WiFi", icon: "📶" },
]

const spaceCategories = [
  { id: "cafe", label: "Café", icon: Coffee },
  { id: "library", label: "Library", icon: Book },
  { id: "park", label: "Park", icon: TreePine },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
]

const spaceTypes = [
  { id: "commercial", label: "Commercial", icon: Building },
  { id: "private", label: "Private", icon: Home },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [filteredSpaces, setFilteredSpaces] = useState(mockSpaces)
  const [activeView, setActiveView] = useState("list")

  useEffect(() => {
    // Try to fetch from Flask backend, fallback to mock data
    const fetchSpaces = async () => {
      try {
        const response = await spacesAPI.getSpaces({
          category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
          type: selectedTypes.length > 0 ? selectedTypes[0] : undefined,
          page: 1,
          limit: 20,
        })
        setFilteredSpaces(response.spaces || mockSpaces)
      } catch (error) {
        console.log("Using mock data - Flask backend not available yet")
        // Filter mock data based on current filters
        const filtered = mockSpaces.filter((space) => {
          const matchesSearch =
            space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            space.address.toLowerCase().includes(searchQuery.toLowerCase())

          const matchesFeatures =
            selectedFeatures.length === 0 || selectedFeatures.every((feature) => space.features.includes(feature))

          const matchesCategories =
            selectedCategories.length === 0 || selectedCategories.some((category) => space.category === category)

          const matchesTypes = selectedTypes.length === 0 || selectedTypes.includes(space.type)

          return matchesSearch && matchesFeatures && matchesCategories && matchesTypes
        })
        setFilteredSpaces(filtered)
      }
    }

    fetchSpaces()
  }, [selectedCategories, selectedTypes, searchQuery, selectedFeatures])

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((f) => f !== featureId) : [...prev, featureId],
    )
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) => (prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Hidden Spaces
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/spaces/add">
                <Button>Add Space</Button>
              </Link>
              <Link to="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Hidden Spaces</h1>
          <p className="text-gray-600">Find the perfect community space for your needs</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search spaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Space Types (Commercial vs Private) */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Space Type</Label>
                  <div className="space-y-2">
                    {spaceTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.id}
                          checked={selectedTypes.includes(type.id)}
                          onCheckedChange={() => toggleType(type.id)}
                        />
                        <Label htmlFor={type.id} className="flex items-center gap-2 cursor-pointer">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Space Categories (Café, Library, etc.) */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Space Categories</Label>
                  <div className="space-y-2">
                    {spaceCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label htmlFor={category.id} className="flex items-center gap-2 cursor-pointer">
                          <category.icon className="w-4 h-4" />
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accessibility Features */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Accessibility Features</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {accessibilityFeatures.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature.id}
                          checked={selectedFeatures.includes(feature.id)}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                        <Label htmlFor={feature.id} className="flex items-center gap-2 cursor-pointer text-sm">
                          <span>{feature.icon}</span>
                          {feature.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedFeatures([])
                    setSelectedCategories([])
                    setSelectedTypes([])
                    setSearchQuery("")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="map">Map View</TabsTrigger>
                </TabsList>
                <div className="text-sm text-gray-600">{filteredSpaces.length} spaces found</div>
              </div>

              <TabsContent value="list" className="space-y-6">
                {filteredSpaces.map((space) => (
                  <Card key={space.id} className="hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={space.image || "/placeholder.svg"}
                          alt={space.name}
                          className="w-full h-48 md:h-full object-cover rounded-l-lg"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{space.name}</h3>
                            <p className="text-gray-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {space.address}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="secondary">{space.category}</Badge>
                            <Badge
                              variant={space.type === "commercial" ? "default" : "outline"}
                              className={
                                space.type === "commercial"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800 border-green-300"
                              }
                            >
                              {space.type === "commercial" ? (
                                <Building className="w-3 h-3 mr-1" />
                              ) : (
                                <Home className="w-3 h-3 mr-1" />
                              )}
                              {space.type === "commercial" ? "Commercial" : "Private"}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{space.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {space.features.slice(0, 4).map((feature) => {
                            const featureInfo = accessibilityFeatures.find((f) => f.id === feature)
                            return featureInfo ? (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {featureInfo.icon} {featureInfo.label}
                              </Badge>
                            ) : null
                          })}
                          {space.features.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{space.features.length - 4} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {space.rating}
                            </div>
                            <div>{space.distance}</div>
                          </div>
                          <Link to={`/spaces/${space.id}`}>
                            <Button>View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="map">
                <Card className="h-96">
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
                      <p className="text-gray-600">
                        Map integration would be implemented here using a mapping library like Mapbox or Google Maps.
                        This would show all filtered spaces as markers on an interactive map.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
