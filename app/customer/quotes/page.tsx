"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Car, FileDown, AlertTriangle, Calendar } from "lucide-react"
import { toast } from "sonner"
import { customerAPI } from '@/lib/api'

type QuoteRequest = {
  id: number;
  vehicleId: number;
  vehicleName: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function QuotesPage() {
  const router = useRouter()
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCancelDialog, setShowCancelDialog] = useState<number | null>(null)

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const fetchQuoteRequests = async (page: number, status: string) => {
    try {
      setLoading(true)
      const response = await customerAPI.getQuoteRequests({
        page,
        size: ITEMS_PER_PAGE
      })
      
      let filteredRequests = response.content
      if (status !== 'ALL') {
        filteredRequests = filteredRequests.filter(request => request.status === status)
      }
      
      setQuoteRequests(filteredRequests)
      setTotalPages(Math.ceil(response.totalElements / ITEMS_PER_PAGE))
    } catch (error) {
      console.error('Error fetching quote requests:', error)
      toast.error('Failed to fetch quote requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuoteRequests(currentPage, selectedStatus)
  }, [currentPage, selectedStatus])

  const fetchQuoteRequestById = async (id: number) => {
    try {
      const quote = await customerAPI.getQuoteRequestById(id)
      setSelectedQuote(quote)
    } catch (error) {
      toast.error("Failed to fetch quote request details")
      console.error(error)
    }
  }

  const handleCancelClick = (id: number) => {
    setShowCancelDialog(id);
  };

  const cancelQuoteRequest = async (id: number) => {
    try {
      await customerAPI.cancelQuoteRequest(id);
      toast.success('Quote request cancelled successfully');
      fetchQuoteRequests(currentPage, selectedStatus);
      setShowCancelDialog(null);
    } catch (error) {
      console.error('Error cancelling quote request:', error);
      toast.error('Failed to cancel quote request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "quoted":
        return <Badge className="bg-green-500">Quoted</Badge>
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const downloadPDF = (quote: QuoteRequest) => {
    router.push(`/customer/quotes/download/${quote.id}`)
  }

  

  const filteredRequests = quoteRequests.filter(request => {
    const matchesStatus = selectedStatus === 'ALL' || request.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      request.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading quote requests...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Quote Requests</h1>
        <Button 
          onClick={() => router.push('/customer/vehicles')}
          className="bg-red-600 hover:bg-red-700"
        >
          Request New Quote
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by vehicle name or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-64">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No quote requests found</p>
          <Button 
            onClick={() => router.push('/customer/vehicles')}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Request New Quote
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <li key={request.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {request.vehicleName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Status: {request.status}
                    </p>
                    {request.notes && (
                      <p className="mt-1 text-sm text-gray-500">
                        Notes: {request.notes}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Created: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-4">
                    <button
                      onClick={() => fetchQuoteRequestById(request.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      View Details
                    </button>
                    {request.status === 'APPROVED' && (
                      <button
                        onClick={() => downloadPDF(request)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Download
                      </button>
                    )}
                    {request.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelClick(request.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => fetchQuoteRequests(i, selectedStatus)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                  currentPage === i
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Quote Details Dialog */}
      {selectedQuote && (
        <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quote Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Quote ID: {selectedQuote.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created on: {new Date(selectedQuote.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(selectedQuote.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>Vehicle ID: {selectedQuote.vehicleId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Last Updated: {new Date(selectedQuote.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {selectedQuote.notes && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">Notes:</p>
                  <p className="text-sm">{selectedQuote.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter className="flex sm:justify-between">
              <div className="flex gap-2">
                {selectedQuote.status.toLowerCase() === "pending" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleCancelClick(selectedQuote.id)
                    }}
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Cancel
                  </Button>
                )}
                {selectedQuote.status.toLowerCase() === "approved" && (
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

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog !== null} onOpenChange={(open) => !open && setShowCancelDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Quote Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              <p className="text-sm font-medium">Are you sure you want to cancel this quote request?</p>
            </div>
            <p className="text-sm text-gray-600">
              This action cannot be undone. The dealer will be notified of the cancellation.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(null)}
              className="flex-1"
            >
              No, Keep Request
            </Button>
            <Button
              variant="destructive"
              onClick={() => showCancelDialog && cancelQuoteRequest(showCancelDialog)}
              className="flex-1"
            >
              Yes, Cancel Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}