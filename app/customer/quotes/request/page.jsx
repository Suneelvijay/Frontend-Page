"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { quoteRequestAPI } from "@/lib/api"
import { toast } from "sonner"

export default function RequestQuotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vehicleIdParam = searchParams.get("vehicleId")

  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await quoteRequestAPI.createQuoteRequest({
        vehicleId: Number(vehicleIdParam),
        notes: notes
      })
      
      toast.success("Quote request submitted successfully")
      router.push("/customer/quotes")
    } catch (error) {
      toast.error("Failed to submit quote request")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
            <CardTitle>Request Quote</CardTitle>
              </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes
                </label>
                  <Textarea
                    id="notes"
                  placeholder="Enter any additional information or requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                </Button>
              </div>
            </form>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
