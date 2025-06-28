"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Users, MapPin, Save, X, Building, Home } from "lucide-react"
import { spacesAPI } from "@/lib/api"

const accessibilityFeatures = [
  { id: "accessible_restrooms", label: "Accessible Restrooms" },
  { id: "step_free", label: "Step-Free Access" },
  { id: "braille", label: "Braille Options" },
  { id: "calm_spaces", label: "Calm Spaces" },
  { id: "wifi", label: "Free WiFi" },
  { id: "quiet", label: "Quiet Environment" },
  { id: "outdoor_seating", label: "Outdoor Seating" },
]

const spaceCategories = [
  "Café",
  "Library",
  "Park",
  "Community Center",
  "Restaurant",
  "Coworking Space",
  "Gallery",
  "Museum",
  "Other",
]

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
  },
}

export default function EditSpacePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "commercial",
    address: "",
    description: "",
    website: "",
    phone: "",
    contactEmail: "",
    features: [] as string[],
    indoor: true,
    outdoor: false,
    wifi: false,
    parking: false,
    hours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        if (id) {
          const response = await spacesAPI.getSpace(id)
          setFormData({
            name: response.name,
            category: response.category,
            type: response.type,
            address: response.address,
            description: response.description,
            website: response.website || "",
            phone: response.phone || "",
            contactEmail: response.contactEmail || "",
            features: response.features || [],
            indoor: response.indoor,
            outdoor: response.outdoor,
            wifi: response.wifi,
            parking: response.parking,
            hours: response.hours || {
              monday: "",
              tuesday: "",
              wednesday: "",
              thursday: "",
              friday: "",
              saturday: "",
              sunday: "",
            },
          })
        }
      } catch (error) {
        console.log("Using mock data - Flask backend not available yet")
        const spaceData = mockSpaceData[Number(id) as keyof typeof mockSpaceData]
        if (spaceData) {
          setFormData({
            name: spaceData.name,
            category: spaceData.category,
            type: spaceData.type,
            address: spaceData.address,
            description: spaceData.description,
            website: spaceData.website || "",
            phone: spaceData.phone || "",
            contactEmail: spaceData.contactEmail || "",
            features: spaceData.features,
            indoor: spaceData.indoor,
            outdoor: spaceData.outdoor,
            wifi: spaceData.wifi,
            parking: spaceData.parking,
            hours: spaceData.hours || {
              monday: "",
              tuesday: "",
              wednesday: "",
              thursday: "",
              friday: "",
              saturday: "",
              sunday: "",
            },
          })
        }
      }
    }

    fetchSpace()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (id) {
        await spacesAPI.updateSpace(id, formData)
        navigate(`/spaces/${id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update space")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateHours = (day: string, hours: string) => {
    setFormData((prev) => ({
      ...prev,
      hours: { ...prev.hours, [day]: hours },
    }))
  }

  const toggleFeature = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((f) => f !== featureId)
        : [...prev.features, featureId],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
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
              <Link to={`/spaces/${id}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Space</h1>
          <p className="text-gray-600">Update the information for your space</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Space Type */}
          <Card>
            <CardHeader>
              <CardTitle>Space Type</CardTitle>
              <CardDescription>Select whether this is a commercial or private space</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => updateFormData("type", value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value="commercial" id="commercial" />
                  <Label htmlFor="commercial" className="flex items-center gap-2 cursor-pointer">
                    <Building className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Commercial Space</div>
                      <div className="text-sm text-gray-600">Public businesses, cafes, libraries, etc.</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                    <Home className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Private Space</div>
                      <div className="text-sm text-gray-600">Personal spaces available for community use</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the core details about your space</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Space Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Central Community Library"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Space Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select space category" />
                    </SelectTrigger>
                    <SelectContent>
                      {spaceCategories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    placeholder="Full address of the space"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the space, its atmosphere, and what makes it special..."
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData("contactEmail", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>
              </div>

              {formData.type === "commercial" && (
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Space Features */}
          <Card>
            <CardHeader>
              <CardTitle>Space Features</CardTitle>
              <CardDescription>Select the features available at your space</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="indoor"
                      checked={formData.indoor}
                      onCheckedChange={(checked) => updateFormData("indoor", checked)}
                    />
                    <Label htmlFor="indoor">Indoor Space</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="outdoor"
                      checked={formData.outdoor}
                      onCheckedChange={(checked) => updateFormData("outdoor", checked)}
                    />
                    <Label htmlFor="outdoor">Outdoor Space</Label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wifi"
                      checked={formData.wifi}
                      onCheckedChange={(checked) => updateFormData("wifi", checked)}
                    />
                    <Label htmlFor="wifi">Free WiFi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parking"
                      checked={formData.parking}
                      onCheckedChange={(checked) => updateFormData("parking", checked)}
                    />
                    <Label htmlFor="parking">Parking Available</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Features */}
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
              <CardDescription>Select all accessibility features available at your space</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {accessibilityFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.id}
                      checked={formData.features.includes(feature.id)}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                    <Label htmlFor={feature.id} className="text-sm">
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opening Hours - Only for Commercial Spaces */}
          {formData.type === "commercial" && (
            <Card>
              <CardHeader>
                <CardTitle>Opening Hours</CardTitle>
                <CardDescription>Set the opening hours for each day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(formData.hours).map(([day, hours]) => (
                    <div key={day} className="grid grid-cols-3 gap-4 items-center">
                      <Label className="capitalize font-medium">{day}</Label>
                      <Input
                        placeholder="e.g., 9:00 AM - 8:00 PM"
                        value={hours}
                        onChange={(e) => updateHours(day, e.target.value)}
                        className="col-span-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
            <Link to={`/spaces/${id}`}>
              <Button type="button" variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
