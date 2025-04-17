"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { generateTestDrivePDF } from "@/lib/generate-pdf"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, ArrowLeft } from "lucide-react"

// Mock data for test drives
const mockTestDrives = [
  {
    id: 1,
    vehicleName: "Kia Seltos",
    vehicleId: 1,
    bookingDate: "2023-04-15",
    bookingTime: "10:30 AM",
    dealerName: "Kia Motors Whitefield",
    dealerAddress: "100 Feet Road, Whitefield, Bangalore",
    status: "Scheduled",
    createdAt: "2023-04-10",
  },
  {
    id: 2,
    vehicleName: "Kia Sonet",
    vehicleId: 2,
    bookingDate: "2023-04-20",
    bookingTime: "03:00 PM",
    dealerName: "Kia Motors Indiranagar",
    dealerAddress: "100 Feet Road, Indiranagar, Bangalore",
    status: "Completed",
    createdAt: "2023-04-05",
  },
]

export default function TestDriveDownloadPage({ params }) {
  const router = useRouter()
  const [testDrive, setTestDrive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch the test drive by ID from an API
    const id = Number.parseInt(params.id)
    const foundTestDrive = mockTestDrives.find((td) => td.id === id)

    if (foundTestDrive) {
      setTestDrive(foundTestDrive)
    }

    setLoading(false)
  }, [params.id])

  const handleDownload = () => {
    if (!testDrive) return

    const doc = generateTestDrivePDF(testDrive)
    doc.save(`test-drive-${testDrive.id}.pdf`)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center">Loading test drive details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!testDrive) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center">Test drive not found</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/customer/test-drives")}>
              Back to Test Drives
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
          <CardTitle>Download Test Drive Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">{testDrive.vehicleName}</p>
            <p>Booking ID: TD{testDrive.id.toString().padStart(6, "0")}</p>
            <p>Date: {testDrive.bookingDate}</p>
            <p>Time: {testDrive.bookingTime}</p>
            <p>Dealer: {testDrive.dealerName}</p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => router.push("/customer/test-drives")}>
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
