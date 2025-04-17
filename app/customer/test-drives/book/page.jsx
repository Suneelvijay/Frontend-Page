"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, MapPin } from "lucide-react"

// Mock data for vehicles
const mockVehicles = [
  {
    id: 1,
    name: "Kia Seltos",
    category: "SUV",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Kia Sonet",
    category: "SUV",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Kia Carnival",
    category: "MPV",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Kia EV6",
    category: "Electric",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Kia Carens",
    category: "MPV",
    image: "/placeholder.svg?height=200&width=300",
  },
]

// Mock data for dealers
const mockDealers = [
  {
    id: 1,
    name: "Kia Motors Whitefield",
    address: "100 Feet Road, Whitefield, Bangalore",
    phone: "+91 9876543210",
  },
  {
    id: 2,
    name: "Kia Motors Indiranagar",
    address: "100 Feet Road, Indiranagar, Bangalore",
    phone: "+91 9876543211",
  },
  {
    id: 3,
    name: "Kia Motors Electronic City",
    address: "Electronic City Phase 1, Bangalore",
    phone: "+91 9876543212",
  },
]

// Available time slots
const timeSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
]

export default function BookTestDrivePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vehicleIdParam = searchParams.get("vehicleId")

  const [selectedVehicle, setSelectedVehicle] = useState(vehicleIdParam ? Number.parseInt(vehicleIdParam) : "")
  const [selectedDealer, setSelectedDealer] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [preferredContact, setPreferredContact] = useState("phone")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Find the selected vehicle details
  const vehicleDetails = selectedVehicle ? mockVehicles.find((v) => v.id === Number.parseInt(selectedVehicle)) : null

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to test drives page
      router.push("/customer/test-drives")
    }, 1500)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Book a Test Drive</h1>
        <Link href="/customer/test-drives">
          <Button variant="outline">Back to Test Drives</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Test Drive Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vehicle Selection */}
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Select Vehicle</Label>
                  <Select value={selectedVehicle.toString()} onValueChange={setSelectedVehicle} required>
                    <SelectTrigger id="vehicle">
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.name} ({vehicle.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dealer Selection */}
                <div className="space-y-2">
                  <Label htmlFor="dealer">Select Dealer</Label>
                  <Select value={selectedDealer} onValueChange={setSelectedDealer} required>
                    <SelectTrigger id="dealer">
                      <SelectValue placeholder="Select a dealer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDealers.map((dealer) => (
                        <SelectItem key={dealer.id} value={dealer.id.toString()}>
                          {dealer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable past dates and Sundays
                          return date < new Date() || date.getDay() === 0
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time">Select Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime} required disabled={!selectedDate}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Contact Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Contact Method</Label>
                    <RadioGroup value={preferredContact} onValueChange={setPreferredContact} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone-contact" />
                        <Label htmlFor="phone-contact">Phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email-contact" />
                        <Label htmlFor="email-contact">Email</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting || !selectedVehicle || !selectedDealer || !selectedDate || !selectedTime}
                >
                  {isSubmitting ? "Booking..." : "Book Test Drive"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div className="lg:col-span-1">
          {/* Selected Vehicle Preview */}
          {vehicleDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Vehicle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Image
                  src={vehicleDetails.image || "/placeholder.svg"}
                  alt={vehicleDetails.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold text-lg">{vehicleDetails.name}</h3>
                  <p className="text-muted-foreground">{vehicleDetails.category}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Dealer Preview */}
          {selectedDealer && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Selected Dealer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {mockDealers.find((d) => d.id.toString() === selectedDealer)?.name}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{mockDealers.find((d) => d.id.toString() === selectedDealer)?.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Drive Information */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Test Drive Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">What to bring:</span> Valid driving license, ID proof
                </p>
                <p className="text-sm">
                  <span className="font-medium">Duration:</span> Approximately 30 minutes
                </p>
                <p className="text-sm">
                  <span className="font-medium">Cancellation:</span> You can cancel your test drive up to 4 hours before
                  the scheduled time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
