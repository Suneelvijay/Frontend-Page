"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { generateQuotePDF } from "@/lib/generate-pdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, ArrowLeft } from "lucide-react"

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
]

export default function QuoteDownloadPage({ params }) {
  const router = useRouter()
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch the quote by ID from an API
    const id = Number.parseInt(params.id)
    const foundQuote = mockQuoteRequests.find((q) => q.id === id)

    if (foundQuote) {
      setQuote(foundQuote)
    }

    setLoading(false)
  }, [params.id])

  const handleDownload = () => {
    if (!quote) return

    const doc = generateQuotePDF(quote)
    doc.save(`quote-${quote.id}.pdf`)
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center">Loading quote details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center">Quote not found</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/customer/quotes")}>
              Back to Quotes
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (quote.status !== "Quoted") {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Quote Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This quote is still pending or has been cancelled. Only quotes with a confirmed price can be downloaded.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/customer/quotes")}>
              Back to Quotes
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Download Quote Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">{quote.vehicleName}</p>
            <p>Quote ID: QR{quote.id.toString().padStart(6, "0")}</p>
            <p>Variant: {quote.variant}</p>
            <p>Color: {quote.color}</p>
            <p>Quoted Price: {formatPrice(quote.quotedPrice)}</p>
            <p>Valid Until: {quote.validUntil}</p>
            <p>Dealer: {quote.dealerName}</p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => router.push("/customer/quotes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleDownload}>
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
