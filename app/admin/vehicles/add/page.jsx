"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // Add this import
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload } from "lucide-react"
import { toast } from "sonner"

export default function AddVehiclePage() {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState(null)
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fuelType: "",
    color: "",
    price: "",
    type: "" // Remove default value since we'll set it after fetching
  })
  const [imageFile, setImageFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          toast.error("You need to be logged in")
          router.push("/login")
          return
        }

        const response = await fetch("http://192.168.1.19:8080/api/vehicle-types", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch vehicle types")
        }

        const data = await response.json()
        console.log("Fetched vehicle types:", data) // Debug log
        setVehicleTypes(data)
        
        // Set default type to first vehicle type if available
        if (data.length > 0) {
          setFormData(prev => ({
            ...prev,
            type: data[0].name
          }))
        }
      } catch (error) {
        toast.error("Failed to load vehicle types")
        console.error("Error fetching vehicle types:", error)
      }
    }

    fetchVehicleTypes()
  }, [router])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!imageFile) {
      toast.error("Please upload an image")
      return
    }
    
    setIsLoading(true)
    
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        toast.error("You need to be logged in")
        router.push("/login")
        return
      }
      
      const formPayload = new FormData()
      
      // Add all form fields to the FormData
      formPayload.append("image", imageFile)
      formPayload.append("name", formData.name)
      formPayload.append("description", formData.description)
      formPayload.append("fuelType", formData.fuelType)
      formPayload.append("color", formData.color)
      formPayload.append("price", formData.price)
      formPayload.append("type", formData.type)
      
      const response = await fetch("http://192.168.1.19:8080/api/vehicles/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formPayload
      })
      
      if (!response.ok) {
        // Handle different response status codes
        if (response.status === 204) {
          // No content but successful
          toast.success("Vehicle created successfully")
          router.push("/admin/vehicles")
          return
        }
        
        // Try to parse error message, but handle the case where it's not valid JSON
        let errorData = null
        try {
          const text = await response.text()
          if (text) {
            errorData = JSON.parse(text)
          }
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError)
          throw new Error("Failed to create vehicle: Invalid response from server")
        }
        
        throw new Error(errorData?.message || `Failed to create vehicle (${response.status})`)
      }
      
      // Check if there's content before trying to parse it
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const contentLength = response.headers.get("content-length")
        if (contentLength && parseInt(contentLength) > 0) {
          // Only try to parse JSON if there's actual content
          await response.json() // We're not using the result, just making sure it's valid
        }
      }
      
      toast.success("Vehicle created successfully")
      router.push("/admin/vehicles")
      
    } catch (error) {
      toast.error(error.message || "An error occurred while creating the vehicle")
      console.error("Vehicle creation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Link href="/admin/vehicles">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vehicles
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Add New Vehicle</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>Enter the details of the new vehicle to add to the inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="vehicleForm" className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Kia Seltos" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input 
                    id="price" 
                    placeholder="e.g. 989000" 
                    type="number" 
                    required 
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter vehicle description" 
                  className="min-h-[100px]" 
                  required 
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("fuelType", value)}
                    value={formData.fuelType}
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
                    placeholder="e.g. White" 
                    required 
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("type", value)}
                  value={formData.type}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(vehicleTypes) && vehicleTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Vehicle Image</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Vehicle Preview"
                          className="h-full object-contain"
                          width={500}
                          height={300}
                          style={{ width: '100%', height: '100%' }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                        </div>
                      )}
                      <input 
                        id="image" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        required
                      />
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/admin/vehicles")}>Cancel</Button>
            <Button type="submit" form="vehicleForm" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Vehicle"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}