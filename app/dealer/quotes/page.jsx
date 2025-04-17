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
import { Search, MoreHorizontal, Download, Calendar, FileText, Filter, Car } from "lucide-react"

// Sample quote request data
const quoteRequests = [
  {
    id: 1,
    customerName: "Vikram Singh",
    customerEmail: "vikram.singh@example.com",
    customerPhone: "+91 98765 43210",
    vehicle: "Kia EV6",
    variant: "GT Line",
    color: "Moonscape",
    requestDate: "2023-05-14",
    status: "pending",
    notes: "Customer is interested in financing options for the EV6.",
  },
  {
    id: 2,
    customerName: "Neha Gupta",
    customerEmail: "neha.gupta@example.com",
    customerPhone: "+91 87654 32109",
    vehicle: "Kia Seltos",
    variant: "GTX+",
    color: "Intense Red",
    requestDate: "2023-05-13",
    status: "completed",
    notes: "Customer is looking for the top variant with all features.",
    quoteAmount: "₹18,65,000",
  },
  {
    id: 3,
    customerName: "Rajesh Verma",
    customerEmail: "rajesh.verma@example.com",
    customerPhone: "+91 76543 21098",
    vehicle: "Kia Carens",
    variant: "Luxury Plus",
    color: "Imperial Blue",
    requestDate: "2023-05-12",
    status: "pending",
    notes: "Customer needs a 7-seater for family use.",
  },
  {
    id: 4,
    customerName: "Ananya Desai",
    customerEmail: "ananya.desai@example.com",
    customerPhone: "+91 65432 10987",
    vehicle: "Kia Sonet",
    variant: "HTX",
    color: "Aurora Black Pearl",
    requestDate: "2023-05-11",
    status: "completed",
    notes: "Customer is upgrading from a hatchback.",
    quoteAmount: "₹12,45,000",
  },
  {
    id: 5,
    customerName: "Karan Malhotra",
    customerEmail: "karan.malhotra@example.com",
    customerPhone: "+91 54321 09876",
    vehicle: "Kia Carnival",
    variant: "Limousine",
    color: "Glacier White Pearl",
    requestDate: "2023-05-10",
    status: "completed",
    notes: "Customer is a business owner looking for a luxury vehicle.",
    quoteAmount: "₹34,95,000",
  },
]

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredQuotes = quoteRequests.filter((quote) => {
    const matchesSearch =
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.vehicle.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && quote.status === statusFilter
  })

  const handleExportToExcel = () => {
    // In a real application, this would generate and download an Excel file
    alert("Exporting quote request data to Excel...")
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Quote Requests</h1>
          <Button onClick={handleExportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Quote Requests</CardTitle>
            <CardDescription>View and respond to customer quote requests for vehicles.</CardDescription>
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
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="hidden md:table-cell">Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Quote Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No quote requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuotes.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell>
                            <div className="font-medium">{quote.customerName}</div>
                            <div className="text-sm text-muted-foreground">{quote.customerEmail}</div>
                          </TableCell>
                          <TableCell>
                            <div>{quote.vehicle}</div>
                            <div className="text-sm text-muted-foreground">{quote.variant}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {quote.requestDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={quote.status === "completed" ? "default" : "secondary"}>
                              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{quote.quoteAmount || "-"}</TableCell>
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
                                  <Link href={`/dealer/quotes/${quote.id}`} className="flex w-full items-center">
                                    View details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  {quote.status === "completed" ? "Edit quote" : "Provide quote"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Car className="mr-2 h-4 w-4" />
                                  Schedule test drive
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
