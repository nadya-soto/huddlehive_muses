"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Users, MapPin, Plus, Building, Home } from "lucide-react"
import { spacesAPI } from "@/lib/api"

const accessibilityFeatures = [
  { id: "accessible_restrooms", label: "Accessible Restrooms" },
  { id: "inclusive_restrooms", label: "Inclusive Restrooms" },
  { id: "braille", label: "Braille Options" },
  { id: "lift_access", label: "Lift Access" },
  { id: "step_free", label: "Step-Free Access" },
  { id: "auditory_support", label: "Auditory Support" },
  { id: "calm_spaces", label: "Calm Spaces" },
  { id: "trained_staff", label: "Trained Staff" },
  { id: "culturally_inclusive", label: "Culturally Inclusive" },
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

export default function AddSpacePage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    category: "", // café/library/park
    type: "commercial", // commercial or private
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
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await spacesAPI.createSpace(formData)
      navigate("/discover")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add space")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
              <Link to="/discover">
                <Button variant="outline">Back to Discover</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add a New Space</h1>
          <p className="text-gray-600">Help grow our community by adding a hidden space</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Space Information
            </CardTitle>
            <CardDescription>Provide details about the space you'd like to add to our community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Space Type */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Space Type *</Label>
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
              </div>

              {/* Basic Information */}
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

              {/* Contact Information */}
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
                  <p className="text-sm text-gray-600">
                    This email will be used for people to contact you about using the space
                  </p>
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

              {/* Space Features */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Space Features</Label>
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
              </div>

              {/* Accessibility Features */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Accessibility Features</Label>
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
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding Space..." : "Add Space"}
                </Button>
                <Link to="/discover">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
