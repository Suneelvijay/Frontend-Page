"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, Loader2, XCircle, Search, Calendar, Clock, MapPin, FileDown, AlertTriangle, MoreHorizontal, Eye } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

export default function TestDrivesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [allRequests, setAllRequests] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  })

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("http://localhost:8080/api/user/test-drive/list", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          page: pagination.page,
          size: pagination.size
        })
      })

      if (!response.ok) {
        throw new Error("Failed to fetch test drive requests")
      }

      const data = await response.json()
      setAllRequests(data.content)
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      }))
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast.error(error.message || "Failed to load test drive requests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [pagination.page, pagination.size])

  // Filter and search requests on the frontend
  const filteredRequests = useMemo(() => {
    return allRequests.filter(request => {
      const matchesSearch = searchQuery === "" || 
        request.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.notes && request.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesStatus = statusFilter === "ALL" || request.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [allRequests, searchQuery, statusFilter])

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`http://localhost:8080/api/user/test-drive/${id}/cancel`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to cancel test drive request")
      }

      toast.success("Test drive request cancelled successfully")
      fetchRequests() // Refresh the list
    } catch (error) {
      console.error("Error cancelling request:", error)
      toast.error(error.message || "Failed to cancel test drive request")
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "warning"
      case "APPROVED":
        return "success"
      case "REJECTED":
        return "destructive"
      case "CANCELLED":
        return "secondary"
      default:
        return "default"
    }
  }

  const downloadPDF = (request) => {
    // In a real app, this would generate and download a PDF
    alert(`Downloading test drive details for ${request.vehicleName}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Test Drive Requests</h1>
          <Button onClick={() => router.push("/customer/vehicles")}>
            Book New Test Drive
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Test Drive Requests</CardTitle>
            <CardDescription>
              View and manage your test drive requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-[600px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by vehicle name or notes..."
                    className="pl-10 h-12 text-base w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredRequests.length} of {pagination.totalElements} requests
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={pagination.size.toString()}
                    onValueChange={(value) => setPagination(prev => ({ ...prev, size: parseInt(value), page: 0 }))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No test drive requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.vehicleName}</TableCell>
                          <TableCell>
                            {format(new Date(request.requestedDate), "PPP p")}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(request.status)}>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {request.notes || "-"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedRequest(request)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {request.status === "PENDING" && (
                                  <DropdownMenuItem
                                    onClick={() => handleCancel(request.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Request
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page + 1} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                    disabled={pagination.page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages - 1, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Drive Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Test Drive Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedRequest.vehicleName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Booking ID: TD{selectedRequest.id.toString().padStart(6, "0")}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(selectedRequest.status)}>
                  {selectedRequest.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Date: {format(new Date(selectedRequest.requestedDate), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Time: {format(new Date(selectedRequest.requestedDate), "p")}</span>
                </div>
                {selectedRequest.notes && (
                  <div className="flex items-start gap-2">
                    <span className="text-sm text-muted-foreground">Notes: {selectedRequest.notes}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Requested on: {format(new Date(selectedRequest.createdAt), "PPP")}
                </p>
              </div>
            </div>
            <DialogFooter className="flex sm:justify-between">
              <div className="flex gap-2">
                {selectedRequest.status === "PENDING" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleCancel(selectedRequest.id)
                      setSelectedRequest(null)
                    }}
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Cancel
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => downloadPDF(selectedRequest)}
                  className="flex items-center gap-1"
                >
                  <FileDown className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
