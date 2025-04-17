"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Download, Calendar, Phone, Car, Filter } from "lucide-react"

// Sample test drive data
const testDrives = [
  {
    id: 1,
    customerName: "Rahul Sharma",
    customerEmail: "rahul.sharma@example.com",
    customerPhone: "+91 98765 43210",
    vehicle: "Kia Seltos",
    date: "2023-05-15",
    time: "10:00 AM",
    status: "confirmed",
    notes: "Customer is interested in the HTX variant with diesel engine.",
  },
  {
    id: 2,
    customerName: "Priya Patel",
    customerEmail: "priya.patel@example.com",
    customerPhone: "+91 87654 32109",
    vehicle: "Kia Sonet",
    date: "2023-05-15",
    time: "2:30 PM",
    status: "confirmed",
    notes: "Customer wants to compare with Hyundai Venue.",
  },
  {
    id: 3,
    customerName: "Amit Kumar",
    customerEmail: "amit.kumar@example.com",
    customerPhone: "+91 76543 21098",
    vehicle: "Kia Carnival",
    date: "2023-05-16",
    time: "11:15 AM",
    status: "pending",
    notes: "Customer is looking for a premium MPV for family use.",
  },
  {
    id: 4,
    customerName: "Sneha Reddy",
    customerEmail: "sneha.reddy@example.com",
    customerPhone: "+91 65432 10987",
    vehicle: "Kia EV6",
    date: "2023-05-17",
    time: "4:00 PM",
    status: "completed",
    notes: "Customer is interested in electric vehicles and wants to know about charging infrastructure.",
  },
  {
    id: 5,
    customerName: "Vikram Singh",
    customerEmail: "vikram.singh@example.com",
    customerPhone: "+91 54321 09876",
    vehicle: "Kia Carens",
    date: "2023-05-18",
    time: "1:00 PM",
    status: "cancelled",
    notes: "Customer cancelled due to personal emergency.",
  },
  {
    id: 6,
    customerName: "Neha Gupta",
    customerEmail: "neha.gupta@example.com",
    customerPhone: "+91 43210 98765",
    vehicle: "Kia Seltos",
    date: "2023-05-19",
    time: "11:30 AM",
    status: "pending",
    notes: "Customer is comparing with Hyundai Creta and MG Hector.",
  },
]

export default function TestDrivesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTestDrives = testDrives.filter((testDrive) => {
    const matchesSearch =
      testDrive.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testDrive.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testDrive.vehicle.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && testDrive.status === statusFilter
  })

  const handleExportToExcel = () => {
    // In a real application, this would generate and download an Excel file
    alert("Exporting test drive data to Excel...")
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Test Drive Requests</h1>
          <Button onClick={handleExportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Test Drive Requests</CardTitle>
            <CardDescription>View and update the status of customer test drive requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by customer, email, or vehicle..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select defaultValue="all" onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestDrives.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No test drive requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTestDrives.map((testDrive) => (
                        <TableRow key={testDrive.id}>
                          <TableCell>
                            <div className="font-medium">{testDrive.customerName}</div>
                            <div className="text-sm text-muted-foreground">{testDrive.customerEmail}</div>
                          </TableCell>
                          <TableCell>{testDrive.vehicle}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {testDrive.date} at {testDrive.time}
                            </div>
                          </TableCell>
                          <TableCell>
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
                            >
                              {testDrive.status.charAt(0).toUpperCase() + testDrive.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Link
                                    href={`/dealer/test-drives/${testDrive.id}`}
                                    className="flex w-full items-center"
                                  >
                                    View details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Phone className="mr-2 h-4 w-4" />
                                  Call customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Car className="mr-2 h-4 w-4" />
                                  Update status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
