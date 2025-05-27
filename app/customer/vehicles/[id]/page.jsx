"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, ChevronLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import { customerAPI } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function VehicleDetailsPage({ params }) {
  const router = useRouter()
  const vehicleId = params.id
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  // Remove unused state since we're not implementing image gallery yet
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [createdQuoteId, setCreatedQuoteId] = useState(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`http://192.168.125.84:8080/api/vehicles/${vehicleId}`, {
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

  const handleCreateQuoteRequest = async () => {
    try {
      setIsSubmitting(true);
      const response = await customerAPI.createQuoteRequest({
        vehicleId: Number(params.id),
        notes: notes
      });
      setCreatedQuoteId(response.id);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error creating quote request:", error);
      toast.error("Failed to create quote request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setNotes("");
    setCreatedQuoteId(null);
    router.push('/customer/quotes');
  };

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
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
          <Link href="/customer/vehicles">
            <Button variant="outline">Back to Vehicles</Button>
          </Link>
        </div>
      </div>
    )
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
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 md:hidden">{vehicle.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Images */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video w-full">
                {vehicle.image ? (
                  <Image
                    src={`data:image/jpeg;base64,${vehicle.image}`}
                    alt={vehicle.name}
                    width={800}
                    height={450}
                    className="object-cover w-full h-full"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Details and Quote Request */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="bg-red-600 mb-2">
                    {vehicle.type?.name || vehicle.type || 'Unknown Type'}
                  </Badge>
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
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-medium">{vehicle.color}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href={`/customer/test-drives/book?vehicleId=${vehicleId}`} className="block w-full">
                    <Button className="w-full bg-red-600 hover:bg-red-700">Book Test Drive</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Request Form */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Get Detailed Quote</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Interested in this vehicle? Request a detailed quote with all specifications and pricing details.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="notes" className="text-sm font-medium">
                    Additional Notes
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements or questions?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleCreateQuoteRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Request Quote
                    </>
                  )}
                </Button>
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
              {vehicle.features?.map((feature, index) => (
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
                    <span className="text-muted-foreground">Fuel Type</span>
                    <span>{vehicle.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transmission</span>
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote Request Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your quote request has been submitted successfully. You will be notified once the dealer responds.
            </p>
            <div className="flex items-center gap-2 text-green-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Request ID: {createdQuoteId}</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmationClose} className="w-full bg-red-600 hover:bg-red-700">
              View Quote Requests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
