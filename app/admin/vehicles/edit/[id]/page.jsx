"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload } from "lucide-react"

// Sample vehicle data
const vehicles = [
  {
    id: "1",
    name: "Kia Seltos",
    description: "Compact SUV with advanced features",
    fuelType: "Petrol",
    color: "White",
    price: "989000",
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    id: "2",
    name: "Kia Sonet",
    description: "Subcompact SUV with premium features",
    fuelType: "Diesel",
    color: "Red",
    price: "779000",
    image: "/placeholder.svg?height=80&width=120",
  },
]

export default function EditVehiclePage({ params }) {
  const { id } = params
  const [vehicle, setVehicle] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch vehicle data
    const fetchVehicle = () => {
      setLoading(true)
      // Find vehicle by ID from our sample data
      const foundVehicle = vehicles.find((v) => v.id === id)

      if (foundVehicle) {
        setVehicle(foundVehicle)
        setImagePreview(foundVehicle.image)
      }

      setLoading(false)
    }

    fetchVehicle()
  }, [id])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center">
          <p>Loading vehicle data...</p>
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
          <Link href="/admin/vehicles">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vehicles
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
            <form className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input id="name" defaultValue={vehicle.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" defaultValue={vehicle.price} type="number" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={vehicle.description} className="min-h-[100px]" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select defaultValue={vehicle.fuelType.toLowerCase()}>
                    <SelectTrigger id="fuelType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" defaultValue={vehicle.color} required />
                </div>
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
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Vehicle Preview"
                          className="h-full object-contain"
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
                      <input id="image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Update Vehicle</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
