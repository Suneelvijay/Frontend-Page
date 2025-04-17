"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Car, FileDown, AlertTriangle, Calendar, IndianRupee } from "lucide-react"

// Mock data for quote requests
const mockQuoteRequests = [
  {
    id: 1,
    vehicleName: "Kia Seltos",
    vehicleId: 1,
    variant: "GTX Plus",
    color: "Galaxy Black",
    requestDate: "2023-04-10",
    status: "Pending",
    dealerName: "Kia Motors Whitefield",
    quotedPrice: null,
    validUntil: null,
    notes: "Looking for the best offer on the top variant with all accessories.",
  },
  {
    id: 2,
    vehicleName: "Kia Sonet",
    vehicleId: 2,
    variant: "HTX",
    color: "Intense Red",
    requestDate: "2023-04-05",
    status: "Quoted",
    dealerName: "Kia Motors Indiranagar",
    quotedPrice: 1050000,
    validUntil: "2023-05-05",
    notes: "Interested in financing options.",
  },
  {
    id: 3,
    vehicleName: "Kia Carnival",
    vehicleId: 3,
    variant: "Limousine",
    color: "Aurora Black Pearl",
    requestDate: "2023-04-08",
    status: "Cancelled",
    dealerName: "Kia Motors Electronic City",
    quotedPrice: null,
    validUntil: null,
    notes: "Need pricing for the top variant with all features.",
  },
]

export default function QuotesPage() {
  const router = useRouter()
  const [quoteRequests, setQuoteRequests] = useState(mockQuoteRequests)
  const [selectedQuote, setSelectedQuote] = useState(null)

  const cancelQuoteRequest = (id) => {
    setQuoteRequests(quoteRequests.map((qr) => (qr.id === id ? { ...qr, status: "Cancelled" } : qr)))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "Quoted":
        return <Badge className="bg-green-500">Quoted</Badge>
      case "Cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const downloadPDF = (quote) => {
    // In a real app, this would generate and download a PDF
    alert(`Downloading quote details for ${quote.vehicleName}`)
  }

  // Format price to INR
  const formatPrice = (price) => {
    if (!price) return "Not quoted yet"
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quote Requests</h1>
        <div className="flex gap-2">
          <Link href="/customer/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link href="/customer/vehicles">
            <Button className="bg-red-600 hover:bg-red-700">Request New Quote</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="quoted">Quoted</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quoteRequests.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onCancel={() => cancelQuoteRequest(quote.id)}
                onDownload={() => downloadPDF(quote)}
                onView={() => setSelectedQuote(quote)}
                getStatusBadge={getStatusBadge}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quoteRequests
              .filter((q) => q.status === "Pending")
              .map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onCancel={() => cancelQuoteRequest(quote.id)}
                  onDownload={() => downloadPDF(quote)}
                  onView={() => setSelectedQuote(quote)}
                  getStatusBadge={getStatusBadge}
                  formatPrice={formatPrice}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="quoted" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quoteRequests
              .filter((q) => q.status === "Quoted")
              .map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onCancel={() => cancelQuoteRequest(quote.id)}
                  onDownload={() => downloadPDF(quote)}
                  onView={() => setSelectedQuote(quote)}
                  getStatusBadge={getStatusBadge}
                  formatPrice={formatPrice}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quoteRequests
              .filter((q) => q.status === "Cancelled")
              .map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onCancel={() => cancelQuoteRequest(quote.id)}
                  onDownload={() => downloadPDF(quote)}
                  onView={() => setSelectedQuote(quote)}
                  getStatusBadge={getStatusBadge}
                  formatPrice={formatPrice}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quote Details Dialog */}
      {selectedQuote && (
        <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Quote Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedQuote.vehicleName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quote ID: QR{selectedQuote.id.toString().padStart(6, "0")}
                  </p>
                </div>
                {getStatusBadge(selectedQuote.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>Variant: {selectedQuote.variant}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>Color: {selectedQuote.color}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Requested on: {selectedQuote.requestDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>Dealer: {selectedQuote.dealerName}</span>
                </div>
              </div>

              {selectedQuote.status === "Quoted" && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Quoted Price: {formatPrice(selectedQuote.quotedPrice)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Valid Until: {selectedQuote.validUntil}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="text-sm font-medium">Notes:</p>
                <p className="text-sm">{selectedQuote.notes}</p>
              </div>
            </div>
            <DialogFooter className="flex sm:justify-between">
              <div className="flex gap-2">
                {selectedQuote.status === "Pending" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      cancelQuoteRequest(selectedQuote.id)
                      setSelectedQuote({ ...selectedQuote, status: "Cancelled" })
                    }}
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Cancel
                  </Button>
                )}
                {selectedQuote.status === "Quoted" && (
                  <Button
                    variant="outline"
                    onClick={() => downloadPDF(selectedQuote)}
                    className="flex items-center gap-1"
                  >
                    <FileDown className="h-4 w-4" />
                    Download PDF
                  </Button>
                )}
              </div>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function QuoteCard({ quote, onCancel, onDownload, onView, getStatusBadge, formatPrice }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{quote.vehicleName}</CardTitle>
            <p className="text-sm text-muted-foreground">Quote ID: QR{quote.id.toString().padStart(6, "0")}</p>
          </div>
          {getStatusBadge(quote.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span>
              {quote.variant} - {quote.color}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Requested on: {quote.requestDate}</span>
          </div>

          {quote.status === "Quoted" && (
            <div className="flex items-center gap-2 font-medium">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span>{formatPrice(quote.quotedPrice)}</span>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
              View Details
            </Button>
            {quote.status === "Pending" ? (
              <Button variant="destructive" size="sm" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
            ) : quote.status === "Quoted" ? (
              <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
                Download
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex-1" disabled>
                Cancelled
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
