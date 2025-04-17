"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for vehicle details
const mockVehicleDetails = {
  id: 1,
  name: "Kia Seltos",
  category: "SUV",
  price: 1099000,
  fuelType: "Petrol",
  transmission: "Automatic",
  engine: "1.5L Turbo",
  power: "138 bhp",
  torque: "242 Nm",
  mileage: "16.5 kmpl",
  seatingCapacity: 5,
  colors: ["Galaxy Black", "Gravity Grey", "Aurora Black Pearl", "Intense Red"],
  features: [
    "10.25-inch Touchscreen Infotainment",
    "Bose Premium Sound System",
    "Ventilated Front Seats",
    "360° Camera",
    "Panoramic Sunroof",
    "Air Purifier",
    "Wireless Phone Charger",
    "Drive Mode Select",
    "LED Headlamps",
    "Smart Key with Push Button Start",
  ],
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  description:
    "The bold and dynamic Kia Seltos combines stunning design with cutting-edge technology. It's equipped with a powerful 1.5L Turbo engine that delivers exceptional performance while maintaining good fuel efficiency. The spacious interior offers premium comfort with ventilated seats, panoramic sunroof, and Bose sound system. Advanced safety features include 6 airbags, ABS with EBD, and Electronic Stability Control.",
}

export default function VehicleDetailsPage({ params }) {
  const router = useRouter()
  const vehicleId = params.id
  const vehicle = mockVehicleDetails // In a real app, fetch vehicle by ID
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Format price to INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/customer/vehicles">
          <Button variant="outline" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Vehicles
          </Button>
        </Link>
        <h1 className="text-3xl font-bold hidden md:block">{vehicle.name}</h1>
        <div className="flex gap-2">
          <Link href={`/customer/test-drives/book?vehicleId=${vehicleId}`}>
            <Button className="flex items-center gap-1 bg-red-600 hover:bg-red-700">
              <Calendar className="h-4 w-4" />
              Book Test Drive
            </Button>
          </Link>
          <Link href={`/customer/quotes/request?vehicleId=${vehicleId}`}>
            <Button variant="outline" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Request Quote
            </Button>
          </Link>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 md:hidden">{vehicle.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Images */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative">
              <Image
                src={vehicle.images[currentImageIndex] || "/placeholder.svg"}
                alt={vehicle.name}
                width={600}
                height={400}
                className="w-full h-[300px] md:h-[400px] object-cover"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 flex gap-2 overflow-x-auto">
              {vehicle.images.map((image, index) => (
                <Image
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${vehicle.name} - Image ${index + 1}`}
                  width={100}
                  height={75}
                  className={`w-20 h-16 object-cover cursor-pointer rounded ${
                    index === currentImageIndex ? "ring-2 ring-red-600" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Vehicle Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="bg-red-600 mb-2">{vehicle.category}</Badge>
                  <h2 className="text-2xl font-bold">{formatPrice(vehicle.price)}</h2>
                  <p className="text-sm text-muted-foreground">Ex-showroom price</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fuel Type</p>
                    <p className="font-medium">{vehicle.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p className="font-medium">{vehicle.transmission}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engine</p>
                    <p className="font-medium">{vehicle.engine}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Power</p>
                    <p className="font-medium">{vehicle.power}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Torque</p>
                    <p className="font-medium">{vehicle.torque}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mileage</p>
                    <p className="font-medium">{vehicle.mileage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seating</p>
                    <p className="font-medium">{vehicle.seatingCapacity} Seater</p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm font-medium mb-2">Available Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.colors.map((color, index) => (
                      <Badge key={index} variant="outline">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Link href={`/customer/test-drives/book?vehicleId=${vehicleId}`} className="flex-1">
                    <Button className="w-full bg-red-600 hover:bg-red-700">Book Test Drive</Button>
                  </Link>
                  <Link href={`/customer/quotes/request?vehicleId=${vehicleId}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Request Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vehicle Details Tabs */}
      <div className="mt-6">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4">
            <p>{vehicle.description}</p>
          </TabsContent>
          <TabsContent value="features" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-600"></div>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Engine & Transmission</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engine Type</span>
                    <span>{vehicle.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Power</span>
                    <span>{vehicle.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Torque</span>
                    <span>{vehicle.torque}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transmission</span>
                    <span>{vehicle.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type</span>
                    <span>{vehicle.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage</span>
                    <span>{vehicle.mileage}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dimensions & Capacity</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seating Capacity</span>
                    <span>{vehicle.seatingCapacity} Persons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Length</span>
                    <span>4,315 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Width</span>
                    <span>1,800 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height</span>
                    <span>1,645 mm</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wheelbase</span>
                    <span>2,610 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Boot Space</span>
                    <span>433 Liters</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
