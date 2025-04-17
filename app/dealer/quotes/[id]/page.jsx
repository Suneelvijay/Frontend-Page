"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Car, Phone, Mail, MapPin, FileText, CheckCircle, DollarSign, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample quote request data
const quoteRequests = [
  {
    id: "1",
    customerName: "Vikram Singh",
    customerEmail: "vikram.singh@example.com",
    customerPhone: "+91 98765 43210",
    customerAddress: "456 Park Avenue, New Delhi, Delhi",
    vehicle: "Kia EV6",
    variant: "GT Line",
    color: "Moonscape",
    requestDate: "2023-05-14",
    status: "pending",
    notes: "Customer is interested in financing options for the EV6.",
    preferredDealer: "Kia Motors Delhi South",
    createdAt: "2023-05-14",
  },
]

export default function QuoteDetailsPage({ params }) {
  const { id } = params
  const quote = quoteRequests.find((q) => q.id === id)

  const [status, setStatus] = useState(quote?.status || "pending")
  const [notes, setNotes] = useState(quote?.notes || "")
  const [basePrice, setBasePrice] = useState("5995000")
  const [accessories, setAccessories] = useState("150000")
  const [insurance, setInsurance] = useState("85000")
  const [roadTax, setRoadTax] = useState("65000")
  const [discount, setDiscount] = useState("100000")
  const [isSaving, setIsSaving] = useState(false)

  if (!quote) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center">
          <p>Quote request not found.</p>
        </div>
      </div>
    )
  }

  const totalPrice =
    Number.parseInt(basePrice || 0) +
    Number.parseInt(accessories || 0) +
    Number.parseInt(insurance || 0) +
    Number.parseInt(roadTax || 0) -
    Number.parseInt(discount || 0)

  const handleSubmitQuote = () => {
    setIsSaving(true)
    // Simulate API call to submit quote
    setTimeout(() => {
      setIsSaving(false)
      alert(`Quote submitted: ₹${totalPrice.toLocaleString("en-IN")}`)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Link href="/dealer/quotes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Quotes
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Quote Request Details</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Quote Request #{quote.id}</CardTitle>
                    <CardDescription>Created on {quote.createdAt}</CardDescription>
                  </div>
                  <Badge variant={quote.status === "completed" ? "default" : "secondary"} className="text-sm">
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <Car className="mr-2 h-5 w-5" />
                    Vehicle Information
                  </h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vehicle Model</p>
                      <p className="text-base">{quote.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Variant</p>
                      <p className="text-base">{quote.variant}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Color</p>
                      <p className="text-base">{quote.color}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Preferred Dealer</p>
                      <p className="text-base">{quote.preferredDealer}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Additional Notes
                  </h3>
                  <Separator />
                  <p className="text-sm">{quote.notes}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prepare Quote</CardTitle>
                <CardDescription>Create a detailed quote for the customer.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pricing">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pricing">Pricing Details</TabsTrigger>
                    <TabsTrigger value="notes">Notes & Terms</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pricing" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="basePrice">Base Price (₹)</Label>
                        <Input
                          id="basePrice"
                          value={basePrice}
                          onChange={(e) => setBasePrice(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accessories">Accessories (₹)</Label>
                        <Input
                          id="accessories"
                          value={accessories}
                          onChange={(e) => setAccessories(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insurance">Insurance (₹)</Label>
                        <Input
                          id="insurance"
                          value={insurance}
                          onChange={(e) => setInsurance(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roadTax">Road Tax & Registration (₹)</Label>
                        <Input
                          id="roadTax"
                          value={roadTax}
                          onChange={(e) => setRoadTax(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount">Discount (₹)</Label>
                        <Input
                          id="discount"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Price (₹)</Label>
                        <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                          <span className="font-medium">₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="notes" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="quoteNotes">Additional Notes</Label>
                      <Textarea
                        id="quoteNotes"
                        placeholder="Add any additional information, terms, or conditions..."
                        className="min-h-[150px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validity">Quote Validity</Label>
                      <Input
                        id="validity"
                        type="date"
                        defaultValue={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSubmitQuote} disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit Quote
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={quote.customerName} />
                    <AvatarFallback>{quote.customerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-medium">{quote.customerName}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{quote.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm">{quote.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm">{quote.customerAddress}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Car className="mr-2 h-4 w-4" />
                  Schedule Test Drive
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Financing Options
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
