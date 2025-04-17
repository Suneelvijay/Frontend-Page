"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for vehicles
const mockVehicles = [
  {
    id: 1,
    name: "Kia Seltos",
    category: "SUV",
    price: 1099000,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "/placeholder.svg?height=200&width=300",
    description: "The bold and dynamic Kia Seltos combines stunning design with cutting-edge technology.",
  },
  {
    id: 2,
    name: "Kia Sonet",
    category: "SUV",
    price: 779000,
    fuelType: "Diesel",
    transmission: "Manual",
    image: "/placeholder.svg?height=200&width=300",
    description: "The Kia Sonet is a compact SUV designed to deliver a thrilling driving experience.",
  },
  {
    id: 3,
    name: "Kia Carnival",
    category: "MPV",
    price: 2499000,
    fuelType: "Diesel",
    transmission: "Automatic",
    image: "/placeholder.svg?height=200&width=300",
    description: "The Kia Carnival redefines luxury with its spacious interior and premium features.",
  },
  {
    id: 4,
    name: "Kia EV6",
    category: "Electric",
    price: 6095000,
    fuelType: "Electric",
    transmission: "Automatic",
    image: "/placeholder.svg?height=200&width=300",
    description: "The Kia EV6 is an all-electric crossover with futuristic design and impressive range.",
  },
  {
    id: 5,
    name: "Kia Carens",
    category: "MPV",
    price: 1045000,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/placeholder.svg?height=200&width=300",
    description: "The Kia Carens is a versatile family car with three rows of seating and modern features.",
  },
]

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [filters, setFilters] = useState({
    category: "",
    fuelType: "",
    transmission: "",
    priceRange: [0, 7000000],
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Apply filters
  useEffect(() => {
    const filteredVehicles = mockVehicles.filter((vehicle) => {
      return (
        (filters.category === "" || vehicle.category === filters.category) &&
        (filters.fuelType === "" || vehicle.fuelType === filters.fuelType) &&
        (filters.transmission === "" || vehicle.transmission === filters.transmission) &&
        vehicle.price >= filters.priceRange[0] &&
        vehicle.price <= filters.priceRange[1] &&
        (searchQuery === "" || vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })

    setVehicles(filteredVehicles)
  }, [filters, searchQuery])

  // Format price to INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kia Vehicles</h1>
        <Link href="/customer/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Search</label>
                  <Input
                    placeholder="Search vehicles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="MPV">MPV</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Fuel Type</label>
                  <Select
                    value={filters.fuelType}
                    onValueChange={(value) => setFilters({ ...filters, fuelType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Fuel Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fuel Types</SelectItem>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Transmission</label>
                  <Select
                    value={filters.transmission}
                    onValueChange={(value) => setFilters({ ...filters, transmission: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Transmissions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transmissions</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                  </label>
                  <Slider
                    defaultValue={[0, 7000000]}
                    max={7000000}
                    step={100000}
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                    className="mt-2"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFilters({
                      category: "all",
                      fuelType: "all",
                      transmission: "all",
                      priceRange: [0, 7000000],
                    })
                    setSearchQuery("")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle List */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              <span className="text-sm text-muted-foreground">{vehicles.length} vehicles found</span>
            </div>

            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <Image
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                      <p className="text-red-600 font-medium">{formatPrice(vehicle.price)}</p>
                      <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
                        <span>{vehicle.category}</span>
                        <span>•</span>
                        <span>{vehicle.fuelType}</span>
                        <span>•</span>
                        <span>{vehicle.transmission}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Link href={`/customer/vehicles/${vehicle.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Details
                        </Button>
                      </Link>
                      <Link href={`/customer/test-drives/book?vehicleId=${vehicle.id}`} className="flex-1">
                        <Button className="w-full bg-red-600 hover:bg-red-700">Test Drive</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <Image
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        width={300}
                        height={200}
                        className="w-full md:w-64 h-48 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                        <p className="text-red-600 font-medium">{formatPrice(vehicle.price)}</p>
                        <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
                          <span>{vehicle.category}</span>
                          <span>•</span>
                          <span>{vehicle.fuelType}</span>
                          <span>•</span>
                          <span>{vehicle.transmission}</span>
                        </div>
                        <p className="mt-2 text-sm">{vehicle.description}</p>
                        <div className="flex gap-2 mt-4">
                          <Link href={`/customer/vehicles/${vehicle.id}`}>
                            <Button variant="outline">Details</Button>
                          </Link>
                          <Link href={`/customer/test-drives/book?vehicleId=${vehicle.id}`}>
                            <Button className="bg-red-600 hover:bg-red-700">Test Drive</Button>
                          </Link>
                          <Link href={`/customer/quotes/request?vehicleId=${vehicle.id}`}>
                            <Button variant="outline">Request Quote</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
