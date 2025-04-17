"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, FileDown, AlertTriangle } from "lucide-react"

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
  {
    id: 3,
    vehicleName: "Kia Carnival",
    vehicleId: 3,
    bookingDate: "2023-04-25",
    bookingTime: "11:00 AM",
    dealerName: "Kia Motors Electronic City",
    dealerAddress: "Electronic City Phase 1, Bangalore",
    status: "Cancelled",
    createdAt: "2023-04-08",
  },
]

export default function TestDrivesPage() {
  const router = useRouter()
  const [testDrives, setTestDrives] = useState(mockTestDrives)
  const [selectedTestDrive, setSelectedTestDrive] = useState(null)

  const cancelTestDrive = (id) => {
    setTestDrives(testDrives.map((td) => (td.id === id ? { ...td, status: "Cancelled" } : td)))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "Cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const downloadPDF = (testDrive) => {
    // In a real app, this would generate and download a PDF
    alert(`Downloading test drive details for ${testDrive.vehicleName}`)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Test Drives</h1>
        <div className="flex gap-2">
          <Link href="/customer/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link href="/customer/vehicles">
            <Button className="bg-red-600 hover:bg-red-700">Book New Test Drive</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testDrives.map((testDrive) => (
              <TestDriveCard
                key={testDrive.id}
                testDrive={testDrive}
                onCancel={() => cancelTestDrive(testDrive.id)}
                onDownload={() => downloadPDF(testDrive)}
                onView={() => setSelectedTestDrive(testDrive)}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testDrives
              .filter((td) => td.status === "Scheduled")
              .map((testDrive) => (
                <TestDriveCard
                  key={testDrive.id}
                  testDrive={testDrive}
                  onCancel={() => cancelTestDrive(testDrive.id)}
                  onDownload={() => downloadPDF(testDrive)}
                  onView={() => setSelectedTestDrive(testDrive)}
                  getStatusBadge={getStatusBadge}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testDrives
              .filter((td) => td.status === "Completed")
              .map((testDrive) => (
                <TestDriveCard
                  key={testDrive.id}
                  testDrive={testDrive}
                  onCancel={() => cancelTestDrive(testDrive.id)}
                  onDownload={() => downloadPDF(testDrive)}
                  onView={() => setSelectedTestDrive(testDrive)}
                  getStatusBadge={getStatusBadge}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testDrives
              .filter((td) => td.status === "Cancelled")
              .map((testDrive) => (
                <TestDriveCard
                  key={testDrive.id}
                  testDrive={testDrive}
                  onCancel={() => cancelTestDrive(testDrive.id)}
                  onDownload={() => downloadPDF(testDrive)}
                  onView={() => setSelectedTestDrive(testDrive)}
                  getStatusBadge={getStatusBadge}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Test Drive Details Dialog */}
      {selectedTestDrive && (
        <Dialog open={!!selectedTestDrive} onOpenChange={(open) => !open && setSelectedTestDrive(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Test Drive Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedTestDrive.vehicleName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Booking ID: TD{selectedTestDrive.id.toString().padStart(6, "0")}
                  </p>
                </div>
                {getStatusBadge(selectedTestDrive.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Date: {selectedTestDrive.bookingDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Time: {selectedTestDrive.bookingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Dealer: {selectedTestDrive.dealerName}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Address: {selectedTestDrive.dealerAddress}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Booked on: {selectedTestDrive.createdAt}</p>
              </div>
            </div>
            <DialogFooter className="flex sm:justify-between">
              <div className="flex gap-2">
                {selectedTestDrive.status === "Scheduled" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      cancelTestDrive(selectedTestDrive.id)
                      setSelectedTestDrive({ ...selectedTestDrive, status: "Cancelled" })
                    }}
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Cancel
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => downloadPDF(selectedTestDrive)}
                  className="flex items-center gap-1"
                >
                  <FileDown className="h-4 w-4" />
                  Download PDF
                </Button>
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

function TestDriveCard({ testDrive, onCancel, onDownload, onView, getStatusBadge }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{testDrive.vehicleName}</CardTitle>
            <p className="text-sm text-muted-foreground">Booking ID: TD{testDrive.id.toString().padStart(6, "0")}</p>
          </div>
          {getStatusBadge(testDrive.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{testDrive.bookingDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{testDrive.bookingTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{testDrive.dealerName}</span>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
              View Details
            </Button>
            {testDrive.status === "Scheduled" ? (
              <Button variant="destructive" size="sm" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex-1" onClick={onDownload}>
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
