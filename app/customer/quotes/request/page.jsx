"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Mock data for vehicles
const mockVehicles = [
  {
    id: 1,
    name: "Kia Seltos",
    category: "SUV",
    image: "/placeholder.svg?height=200&width=300",
    variants: ["HTE", "HTK", "HTK+", "HTX", "HTX+", "GTX", "GTX+"],
    colors: ["Galaxy Black", "Gravity Grey", "Aurora Black Pearl", "Intense Red", "Imperial Blue"],
    basePrice: 1099000,
  },
  {
    id: 2,
    name: "Kia Sonet",
    category: "SUV",
    image: "/placeholder.svg?height=200&width=300",
    variants: ["HTE", "HTK", "HTK+", "HTX", "HTX+", "GTX", "GTX+"],
    colors: ["Galaxy Black", "Intense Red", "Beige Gold", "Aurora Black Pearl", "Glacier White"],
    basePrice: 779000,
  },
  {
    id: 3,
    name: "Kia Carnival",
    category: "MPV",
    image: "/placeholder.svg?height=200&width=300",
    variants: ["Premium", "Prestige", "Limousine", "Limousine Plus"],
    colors: ["Aurora Black Pearl", "Glacier White", "Panthera Metal"],
    basePrice: 2499000,
  },
  {
    id: 4,
    name: "Kia EV6",
    category: "Electric",
    image: "/placeholder.svg?height=200&width=300",
    variants: ["GT Line", "GT Line AWD"],
    colors: ["Moonscape", "Snow White Pearl", "Aurora Black Pearl", "Runway Red", "Yacht Blue"],
    basePrice: 6095000,
  },
  {
    id: 5,
    name: "Kia Carens",
    category: "MPV",
    image: "/placeholder.svg?height=200&width=300",
    variants: ["Premium", "Prestige", "Prestige Plus", "Luxury", "Luxury Plus"],
    colors: ["Imperial Blue", "Glacier White", "Aurora Black Pearl", "Sparkling Silver", "Gravity Grey"],
    basePrice: 1045000,
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

// Mock data for accessories
const mockAccessories = [
  { id: 1, name: "Alloy Wheels", price: 45000 },
  { id: 2, name: "Roof Rack", price: 15000 },
  { id: 3, name: "Floor Mats", price: 5000 },
  { id: 4, name: "Seat Covers", price: 12000 },
  { id: 5, name: "Infotainment System Upgrade", price: 35000 },
  { id: 6, name: "Ambient Lighting", price: 8000 },
  { id: 7, name: "Dash Camera", price: 10000 },
  { id: 8, name: "Mud Flaps", price: 2000 },
]

export default function RequestQuotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vehicleIdParam = searchParams.get("vehicleId")

  const [selectedVehicle, setSelectedVehicle] = useState(vehicleIdParam ? Number.parseInt(vehicleIdParam) : "")
  const [selectedVariant, setSelectedVariant] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedDealer, setSelectedDealer] = useState("")
  const [selectedAccessories, setSelectedAccessories] = useState([])
  const [financingRequired, setFinancingRequired] = useState("no")
  const [exchangeVehicle, setExchangeVehicle] = useState("no")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [preferredContact, setPreferredContact] = useState("phone")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Find the selected vehicle details
  const vehicleDetails = selectedVehicle ? mockVehicles.find((v) => v.id === Number.parseInt(selectedVehicle)) : null

  // Reset variant and color when vehicle changes
  useEffect(() => {
    setSelectedVariant("")
    setSelectedColor("")
    setSelectedAccessories([])
  }, [selectedVehicle])

  // Format price to INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Calculate estimated price
  const calculateEstimatedPrice = () => {
    if (!vehicleDetails) return 0

    // Base price for the selected variant
    let basePrice = vehicleDetails.basePrice

    // Add variant premium (just for demonstration)
    const variantIndex = vehicleDetails.variants.indexOf(selectedVariant)
    if (variantIndex > -1) {
      basePrice += variantIndex * 50000 // Each higher variant adds 50,000
    }

    // Add accessories price
    const accessoriesPrice = selectedAccessories.reduce((total, accessoryId) => {
      const accessory = mockAccessories.find((a) => a.id === Number.parseInt(accessoryId))
      return total + (accessory ? accessory.price : 0)
    }, 0)

    return basePrice + accessoriesPrice
  }

  // Toggle accessory selection
  const toggleAccessory = (accessoryId) => {
    setSelectedAccessories((prev) => {
      if (prev.includes(accessoryId)) {
        return prev.filter((id) => id !== accessoryId)
      } else {
        return [...prev, accessoryId]
      }
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to quotes page
      router.push("/customer/quotes")
    }, 1500)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Request a Quote</h1>
        <Link href="/customer/quotes">
          <Button variant="outline">Back to Quotes</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
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

                {vehicleDetails && (
                  <>
                    {/* Variant Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="variant">Select Variant</Label>
                      <Select value={selectedVariant} onValueChange={setSelectedVariant} required>
                        <SelectTrigger id="variant">
                          <SelectValue placeholder="Select a variant" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleDetails.variants.map((variant) => (
                            <SelectItem key={variant} value={variant}>
                              {variant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="color">Select Color</Label>
                      <Select value={selectedColor} onValueChange={setSelectedColor} required>
                        <SelectTrigger id="color">
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleDetails.colors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

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

                {/* Accessories */}
                {vehicleDetails && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label>Accessories (Optional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {mockAccessories.map((accessory) => (
                        <div key={accessory.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`accessory-${accessory.id}`}
                            checked={selectedAccessories.includes(accessory.id.toString())}
                            onCheckedChange={() => toggleAccessory(accessory.id.toString())}
                          />
                          <Label htmlFor={`accessory-${accessory.id}`} className="flex-1">
                            {accessory.name} ({formatPrice(accessory.price)})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Financing Options */}
                <div className="space-y-2 pt-4 border-t">
                  <Label>Do you require financing?</Label>
                  <RadioGroup value={financingRequired} onValueChange={setFinancingRequired} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="financing-yes" />
                      <Label htmlFor="financing-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="financing-no" />
                      <Label htmlFor="financing-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Exchange Vehicle */}
                <div className="space-y-2">
                  <Label>Do you have a vehicle for exchange?</Label>
                  <RadioGroup value={exchangeVehicle} onValueChange={setExchangeVehicle} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="exchange-yes" />
                      <Label htmlFor="exchange-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="exchange-no" />
                      <Label htmlFor="exchange-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements or questions..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
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
                  disabled={isSubmitting || !selectedVehicle || !selectedVariant || !selectedColor || !selectedDealer}
                >
                  {isSubmitting ? "Submitting..." : "Request Quote"}
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

                  {selectedVariant && (
                    <p className="mt-1">
                      Variant: <span className="font-medium">{selectedVariant}</span>
                    </p>
                  )}

                  {selectedColor && (
                    <p>
                      Color: <span className="font-medium">{selectedColor}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Price Estimate */}
          {vehicleDetails && selectedVariant && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Price Estimate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Base Price ({selectedVariant})</span>
                    <span className="font-medium">{formatPrice(vehicleDetails.basePrice)}</span>
                  </div>

                  {selectedAccessories.length > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span>Accessories</span>
                        <span className="font-medium">
                          {formatPrice(
                            selectedAccessories.reduce((total, accessoryId) => {
                              const accessory = mockAccessories.find((a) => a.id === Number.parseInt(accessoryId))
                              return total + (accessory ? accessory.price : 0)
                            }, 0),
                          )}
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground pl-4">
                        {selectedAccessories.map((accessoryId) => {
                          const accessory = mockAccessories.find((a) => a.id === Number.parseInt(accessoryId))
                          return accessory ? (
                            <div key={accessory.id} className="flex justify-between">
                              <span>{accessory.name}</span>
                              <span>{formatPrice(accessory.price)}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </>
                  )}

                  <div className="pt-2 border-t flex justify-between items-center font-semibold">
                    <span>Estimated Price</span>
                    <span className="text-lg text-red-600">{formatPrice(calculateEstimatedPrice())}</span>
                  </div>

                  <p className="text-xs text-muted-foreground pt-2">
                    * This is an estimated price. The final price may vary based on dealer offers, taxes, and other
                    charges.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quote Information */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quote Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Response Time:</span> You will receive a response within 24-48 hours.
                </p>
                <p className="text-sm">
                  <span className="font-medium">Validity:</span> Quotes are typically valid for 30 days from the date of
                  issue.
                </p>
                <p className="text-sm">
                  <span className="font-medium">Cancellation:</span> You can cancel your quote request at any time
                  before receiving a response.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
