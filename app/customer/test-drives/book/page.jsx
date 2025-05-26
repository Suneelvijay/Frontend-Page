"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image" // Add this import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function BookTestDrivePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vehicleId = searchParams.get("vehicleId")

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [vehicle, setVehicle] = useState(null)
  const [date, setDate] = useState()
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`http://localhost:8080/api/user/vehicles/${vehicleId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch vehicle details")
        }

        const data = await response.json()
        setVehicle(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching vehicle:", error)
        toast.error(error.message || "Failed to load vehicle details")
        setLoading(false)
      }
    }

    if (vehicleId) {
      fetchVehicleDetails()
    } else {
      toast.error("No vehicle selected")
      router.push("/customer/vehicles")
    }
  }, [vehicleId, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date || !time) {
      toast.error("Please select both date and time")
      return
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Combine date and time into ISO string
      const requestedDate = new Date(date)
      const [hours, minutes] = time.split(":").map(Number)
      requestedDate.setHours(hours, minutes)

      const response = await fetch("http://localhost:8080/api/user/test-drive", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          vehicleId: parseInt(vehicleId),
          requestedDate: requestedDate.toISOString(),
          notes: notes
        })
      })

      if (!response.ok) {
        throw new Error("Failed to book test drive")
      }

      toast.success("Test drive booked successfully!")
      router.push("/customer/test-drives")
    } catch (error) {
      console.error("Error booking test drive:", error)
      toast.error(error.message || "Failed to book test drive")
    } finally {
      setSubmitting(false)
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
        <div className="text-center">
          <h2 className="text-2xl font-bold">Vehicle not found</h2>
          <Button onClick={() => router.push("/customer/vehicles")} className="mt-4">
            Back to Vehicles
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Book Test Drive</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                <div>
                  <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.type?.name || vehicle.type || 'Unknown Type'} • {vehicle.fuelType}</p>
                  <p className="mt-2 text-sm">{vehicle.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Drive Form */}
          <Card>
            <CardHeader>
              <CardTitle>Test Drive Details</CardTitle>
              <CardDescription>
                Please select your preferred date and time for the test drive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) =>
                          date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Time</label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    min="09:00"
                    max="18:00"
                    step="3600"
                  />
                  <p className="text-xs text-muted-foreground">
                    Test drives are available between 9:00 AM and 6:00 PM
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Notes</label>
                  <Textarea
                    placeholder="Any specific features you'd like to test or questions you have..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Instructions</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                    <li>Please arrive 10 minutes before your scheduled time</li>
                    <li>Bring your valid driver&apos;s license</li>
                    <li>The test drive will last approximately 30 minutes</li>
                    <li>Our representative will guide you through the vehicle features</li>
                    <li>In case of any changes, please contact us at least 24 hours in advance</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Book Test Drive"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
