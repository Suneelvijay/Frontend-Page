"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Loader2, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function VehiclesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    type: "ALL",
    fuelType: "ALL",
    priceRange: [0, 10000000],
  })
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalPages: 1,
    totalElements: 0
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch("http://localhost:8080/api/vehicles/list", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            page: pagination.page,
            size: pagination.size
          })
        })

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles")
        }

        const data = await response.json()
        setVehicles(data.content)
        setFilteredVehicles(data.content)
        setPagination(prev => ({
          ...prev,
          totalPages: data.totalPages,
          totalElements: data.totalElements
        }))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        toast.error(error.message || "Failed to load vehicles")
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [pagination.page, pagination.size])

  useEffect(() => {
    let filtered = [...vehicles]

    // Apply type filter
    if (filters.type !== "ALL") {
      filtered = filtered.filter(vehicle => vehicle.type?.name === filters.type)
    }

    // Apply fuel type filter
    if (filters.fuelType !== "ALL") {
      filtered = filtered.filter(vehicle => vehicle.fuelType?.name === filters.fuelType)
    }

    // Apply price range filter
    filtered = filtered.filter(vehicle => 
      vehicle.price >= filters.priceRange[0] && 
      vehicle.price <= filters.priceRange[1]
    )

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(vehicle => 
        (vehicle.name?.toLowerCase() || '').includes(query) ||
        (vehicle.description?.toLowerCase() || '').includes(query) ||
        (vehicle.fuelType?.name?.toLowerCase() || '').includes(query)
      )
    }

    setFilteredVehicles(filtered)
  }, [searchQuery, filters, vehicles])

  const handlePageSizeChange = (size) => {
    setPagination(prev => ({
      ...prev,
      size: parseInt(size),
      page: 0
    }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
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

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {sidebarOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {sidebarOpen && (
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Filters</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Search</label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search vehicles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Vehicle Type</label>
                      <Select
                        value={filters.type}
                        onValueChange={(value) => setFilters({ ...filters, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Types</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="SEDAN">Sedan</SelectItem>
                          <SelectItem value="HATCHBACK">Hatchback</SelectItem>
                          <SelectItem value="MPV">MPV</SelectItem>
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
                          <SelectItem value="ALL">All Fuel Types</SelectItem>
                          <SelectItem value="PETROL">Petrol</SelectItem>
                          <SelectItem value="DIESEL">Diesel</SelectItem>
                          <SelectItem value="ELECTRIC">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                      </label>
                      <Slider
                        defaultValue={[0, 10000000]}
                        max={10000000}
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
                          type: "ALL",
                          fuelType: "ALL",
                          priceRange: [0, 10000000],
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
          )}

          {/* Vehicle Grid */}
          <div className={`lg:col-span-${sidebarOpen ? '3' : '4'}`}>
            <Card>
              <CardHeader>
                <CardTitle>Available Vehicles</CardTitle>
                <CardDescription>
                  Browse through our collection of vehicles. Showing {filteredVehicles.length} of {pagination.totalElements} vehicles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVehicles.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      No vehicles found
                    </div>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="overflow-hidden">
                        <div className="relative h-48 w-full">
                          {vehicle.image ? (
                            <Image
                              src={`data:image/jpeg;base64,${vehicle.image}`}
                              alt={vehicle.name}
                              width={800}
                              height={400}
                              className="object-cover w-full h-full"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No image available</span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                          <p className="text-red-600 font-medium">{formatPrice(vehicle.price)}</p>
                          <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{vehicle.type.name}</Badge>
                            <span>•</span>
                            <span>{vehicle.fuelType.name}</span>
                          </div>
                          <p className="mt-2 text-sm line-clamp-2">{vehicle.description}</p>
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
                    ))
                  )}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((pagination.page) * pagination.size) + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} vehicles
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={pagination.size.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Items per page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm">
                        Page {pagination.page + 1} of {pagination.totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
