"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function VehicleDetailsPage({ params }) {
  const router = useRouter()
  const vehicleId = params.id
  const [loading, setLoading] = useState(true)
  const [vehicle, setVehicle] = useState(null)

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
      } catch (error) {
        console.error("Error fetching vehicle:", error)
        toast.error(error.message || "Failed to load vehicle")
      } finally {
        setLoading(false)
      }
    }

    fetchVehicle()
  }, [vehicleId])

  // Format price to INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/admin/vehicles">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vehicles
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{vehicle.name}</h1>
          </div>
          <Link href={`/admin/vehicles/edit/${vehicleId}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Vehicle
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Vehicle Image */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Image</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.image ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={`data:image/jpeg;base64,${vehicle.image}`}
                    alt={vehicle.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-lg">{vehicle.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                    <p className="text-lg">{formatPrice(vehicle.price)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-lg">{vehicle.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fuel Type</p>
                    <p className="text-lg">{vehicle.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Color</p>
                    <p className="text-lg">{vehicle.color}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vehicle Type</p>
                  <p className="text-lg">{vehicle.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 