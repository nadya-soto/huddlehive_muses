"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Edit,
  Trash2,
  Users,
  Clock,
  Wifi,
  Car,
  Home,
  TreePine,
  Mail,
  Building,
} from "lucide-react"
import { spacesAPI } from "@/lib/api"

// Mock data for demonstration
const mockSpaceData = {
  1: {
    id: 1,
    name: "Central Community Library",
    category: "library",
    type: "commercial",
    address: "123 Main St, Downtown",
    description:
      "A welcoming library with extensive accessibility features and quiet study areas. This historic building has been serving the community for over 50 years and offers a peaceful environment for reading, studying, and community events.",
    website: "https://centrallibrary.org",
    phone: "+1 (555) 123-4567",
    contactEmail: "info@centrallibrary.org",
    rating: 4.8,
    distance: "0.3 miles",
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=300&width=400"],
    features: ["step_free", "braille", "accessible_restrooms", "wifi", "quiet"],
    indoor: true,
    outdoor: false,
    wifi: true,
    parking: true,
    hours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 5:00 PM",
      sunday: "12:00 PM - 5:00 PM",
    },
    ownerId: 1,
    createdBy: "Library Admin",
  },
  2: {
    id: 2,
    name: "Sarah's Garden Studio",
    category: "other",
    type: "private",
    address: "456 Oak Ave, Midtown",
    description:
      "A beautiful private garden studio space perfect for small workshops, meditation sessions, or creative gatherings. Features natural lighting and a peaceful garden setting.",
    phone: "+1 (555) 234-5678",
    contactEmail: "sarah@gardenstudio.com",
    rating: 4.6,
    distance: "0.7 miles",
    images: ["/placeholder.svg?height=400&width=600"],
    features: ["wifi", "outdoor_seating", "accessible_restrooms", "calm_spaces"],
    indoor: true,
    outdoor: true,
    wifi: true,
    parking: false,
    ownerId: 2,
    createdBy: "Sarah Johnson",
  },
}

const accessibilityFeatures = [
  { id: "accessible_restrooms", label: "Accessible Restrooms", icon: "🚻" },
  { id: "step_free", label: "Step-Free Access", icon: "♿" },
  { id: "braille", label: "Braille Options", icon: "⠃" },
  { id: "calm_spaces", label: "Calm Spaces", icon: "🧘" },
  { id: "wifi", label: "Free WiFi", icon: "📶" },
  { id: "quiet", label: "Quiet Environment", icon: "🤫" },
  { id: "outdoor_seating", label: "Outdoor Seating", icon: "🌳" },
]

export default function SpaceDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [space, setSpace] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
    eventDate: "",
    eventType: "",
  })

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        if (id) {
          const response = await spacesAPI.getSpace(id)
          setSpace(response)
          // Check if current user is owner (you'd implement this based on your auth)
          setIsOwner(false) // Set based on actual auth logic
        }
      } catch (error) {
        console.log("Using mock data - Flask backend not available yet")
        const spaceData = mockSpaceData[Number(id) as keyof typeof mockSpaceData]
        if (spaceData) {
          setSpace(spaceData)
          setIsOwner(false) // Demo mode
        }
      }
    }

    fetchSpace()
  }, [id])

  const handleDelete = async () => {
    try {
      if (id) {
        await spacesAPI.deleteSpace(id)
        navigate("/discover")
      }
    } catch (error) {
      console.error("Failed to delete space:", error)
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailBody = `
Name: ${contactForm.name}
Email: ${contactForm.email}
Event Type: ${contactForm.eventType}
Event Date: ${contactForm.eventDate}

Message:
${contactForm.message}
    `

    const mailtoLink = `mailto:${space.contactEmail}?subject=Interest in ${space.name}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoLink

    setShowContactForm(false)
    setContactForm({ name: "", email: "", message: "", eventDate: "", eventType: "" })
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Space not found</h2>
          <p className="text-gray-600 mb-4">The space you're looking for doesn't exist.</p>
          <Link to="/discover">
            <Button>Back to Discover</Button>
          </Link>
        </div>
      </div>
    )
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
              <Link to="/discover">
                <Button variant="outline">Back to Discover</Button>
              </Link>
              {isOwner && (
                <div className="flex items-center space-x-2">
                  <Link to={`/spaces/${space.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Images */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img
                  src={space.images?.[0] || "/placeholder.svg"}
                  alt={space.name}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
                {space.images?.[1] && (
                  <img
                    src={space.images[1] || "/placeholder.svg"}
                    alt={`${space.name} interior`}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{space.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
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
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{space.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">{space.address}</p>
                      <p className="text-sm text-gray-600">{space.distance} away</p>
                    </div>
                  </div>

                  {space.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a href={`tel:${space.phone}`} className="text-blue-600 hover:underline">
                        {space.phone}
                      </a>
                    </div>
                  )}

                  {space.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <a
                        href={space.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {space.indoor && (
                      <Badge variant="outline" className="text-xs">
                        <Home className="w-3 h-3 mr-1" />
                        Indoor
                      </Badge>
                    )}
                    {space.outdoor && (
                      <Badge variant="outline" className="text-xs">
                        <TreePine className="w-3 h-3 mr-1" />
                        Outdoor
                      </Badge>
                    )}
                    {space.wifi && (
                      <Badge variant="outline" className="text-xs">
                        <Wifi className="w-3 h-3 mr-1" />
                        WiFi
                      </Badge>
                    )}
                    {space.parking && (
                      <Badge variant="outline" className="text-xs">
                        <Car className="w-3 h-3 mr-1" />
                        Parking
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Owner
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About {space.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{space.description}</p>
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Added by</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{space.createdBy?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700">{space.createdBy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {space.features?.map((featureId: string) => {
                    const feature = accessibilityFeatures.find((f) => f.id === featureId)
                    return feature ? (
                      <div key={feature.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{feature.icon}</span>
                        <span className="font-medium">{feature.label}</span>
                      </div>
                    ) : null
                  })}
                </div>
                {(!space.features || space.features.length === 0) && (
                  <p className="text-gray-600">No specific accessibility features listed for this space.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {space.type === "commercial" ? "Opening Hours" : "Availability"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {space.type === "commercial" && space.hours ? (
                  <div className="space-y-3">
                    {Object.entries(space.hours).map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-gray-600">{hours as string}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    This is a private space. Please contact the owner for availability information.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Contact {space.createdBy}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name</Label>
                  <Input
                    id="contactName"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Your Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                {space.type === "private" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Input
                        id="eventType"
                        placeholder="e.g., Workshop, Meeting, Celebration"
                        value={contactForm.eventType}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, eventType: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Preferred Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={contactForm.eventDate}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, eventDate: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="contactMessage">Message</Label>
                  <Textarea
                    id="contactMessage"
                    placeholder="Tell them about your interest in using the space..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowContactForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Space</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Are you sure you want to delete "{space.name}"? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete Space
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
