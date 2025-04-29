"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function EditVehiclePage({ params }) {
  const router = useRouter()
  const vehicleId = params.id
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [vehicle, setVehicle] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fuelType: "",
    color: "",
    price: "",
    type: "SUV"
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch vehicle")
        }

        const data = await response.json()
        setVehicle(data)
        setFormData({
          name: data.name || "",
          description: data.description || "",
          fuelType: data.fuelType || "",
          color: data.color || "",
          price: data.price || "",
          type: data.type || "SUV",
          version: data.version || 0 // Store the version from the response
        })
        if (data.image) {
          setImagePreview(data.image)
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error)
        toast.error(error.message || "Failed to load vehicle")
      } finally {
        setLoading(false)
      }
    }

    fetchVehicle()
  }, [vehicleId])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value
    })
  }

  const handleSelectChange = (id, value) => {
    setFormData({
      ...formData,
      [id]: value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB")
        return
      }
      
      setImageFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const formDataToSend = new FormData()
      formDataToSend.append("id", vehicleId)
      formDataToSend.append("version", formData.version.toString())
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("fuelType", formData.fuelType)
      formDataToSend.append("color", formData.color)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("type", formData.type)
      
      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      const response = await fetch("http://localhost:8080/api/vehicles/update-with-image", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (!response.ok) {
        if (response.status === 409) {
          // Handle version conflict
          toast.error("Vehicle was updated by someone else. Latest version loaded.")
          router.push(`/admin/vehicles/${vehicleId}`) // Redirect to view page
          return
        }
        throw new Error("Failed to update vehicle")
      }

      const updatedVehicle = await response.json()
      setFormData(prev => ({
        ...prev,
        version: updatedVehicle.version
      }))

      toast.success("Vehicle updated successfully")
      router.push(`/admin/vehicles/${vehicleId}`)
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error.message || "Failed to update vehicle")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center">
          <p>Vehicle not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Link href={`/admin/vehicles/${vehicleId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vehicle
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Edit Vehicle</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Vehicle Information</CardTitle>
            <CardDescription>Update the details of {vehicle.name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={formData.price}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[100px]" 
                  required 
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select 
                    value={formData.fuelType}
                    onValueChange={(value) => handleSelectChange("fuelType", value)}
                  >
                    <SelectTrigger id="fuelType">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PETROL">Petrol</SelectItem>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                      <SelectItem value="ELECTRIC">Electric</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input 
                    id="color" 
                    value={formData.color}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="SEDAN">Sedan</SelectItem>
                    <SelectItem value="HATCHBACK">Hatchback</SelectItem>
                    <SelectItem value="ELECTRIC">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Vehicle Image</Label>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg">
                      <img
                        src={typeof imagePreview === 'string' && imagePreview.startsWith('data:') 
                          ? imagePreview 
                          : `data:image/jpeg;base64,${imagePreview}`}
                        alt="Vehicle preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Vehicle"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
