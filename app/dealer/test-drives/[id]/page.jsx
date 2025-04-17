"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, Car, Phone, Mail, MapPin, FileText, CheckCircle, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample test drive data
const testDrives = [
  {
    id: "1",
    customerName: "Rahul Sharma",
    customerEmail: "rahul.sharma@example.com",
    customerPhone: "+91 98765 43210",
    customerAddress: "123 Main Street, Mumbai, Maharashtra",
    vehicle: "Kia Seltos",
    variant: "HTX",
    color: "White",
    date: "2023-05-15",
    time: "10:00 AM",
    status: "confirmed",
    notes: "Customer is interested in the HTX variant with diesel engine.",
    preferredDealer: "Kia Motors Mumbai Central",
    createdAt: "2023-05-10",
  },
]

export default function TestDriveDetailsPage({ params }) {
  const { id } = params
  const testDrive = testDrives.find((td) => td.id === id)

  const [status, setStatus] = useState(testDrive?.status || "pending")
  const [notes, setNotes] = useState(testDrive?.notes || "")
  const [isSaving, setIsSaving] = useState(false)

  if (!testDrive) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center">
          <p>Test drive request not found.</p>
        </div>
      </div>
    )
  }

  const handleStatusUpdate = () => {
    setIsSaving(true)
    // Simulate API call to update status
    setTimeout(() => {
      setIsSaving(false)
      alert(`Status updated to: ${status}`)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Link href="/dealer/test-drives">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Test Drives
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Test Drive Details</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Test Drive Request #{testDrive.id}</CardTitle>
                    <CardDescription>Created on {testDrive.createdAt}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      testDrive.status === "confirmed"
                        ? "outline"
                        : testDrive.status === "completed"
                          ? "default"
                          : testDrive.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                    }
                    className="text-sm"
                  >
                    {testDrive.status.charAt(0).toUpperCase() + testDrive.status.slice(1)}
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
                      <p className="text-base">{testDrive.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Variant</p>
                      <p className="text-base">{testDrive.variant}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Color</p>
                      <p className="text-base">{testDrive.color}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Preferred Dealer</p>
                      <p className="text-base">{testDrive.preferredDealer}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Information
                  </h3>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date</p>
                      <p className="text-base">{testDrive.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Time</p>
                      <p className="text-base">{testDrive.time}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Additional Notes
                  </h3>
                  <Separator />
                  <p className="text-sm">{testDrive.notes}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Update Test Drive Status</CardTitle>
                <CardDescription>Change the status of this test drive request and add notes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Dealer Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about this test drive..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleStatusUpdate} disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Update Status
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
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={testDrive.customerName} />
                    <AvatarFallback>{testDrive.customerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-medium">{testDrive.customerName}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{testDrive.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm">{testDrive.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm">{testDrive.customerAddress}</p>
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
                  <Calendar className="mr-2 h-4 w-4" />
                  Reschedule Test Drive
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Quote
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
