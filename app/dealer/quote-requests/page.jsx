"use client"

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Download } from "lucide-react";
import dealerApi from '@/app/api/dealer';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuoteRequests() {
  const { toast } = useToast();
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pageSize, setPageSize] = useState(5);

  const fetchQuoteRequests = useCallback(async () => {
    try {
      const response = await dealerApi.getQuoteRequests(currentPage, pageSize, statusFilter);
      setQuoteRequests(response.content);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch quote requests",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter, toast]);

  useEffect(() => {
    fetchQuoteRequests();
  }, [fetchQuoteRequests]);

  const handleStatusUpdate = async (requestId, status, quotedPrice, adminResponse) => {
    try {
      await dealerApi.updateQuoteRequest(requestId, status, quotedPrice, adminResponse);
      toast({
        title: "Success",
        description: `Quote request ${status.toLowerCase()} successfully`,
      });
      fetchQuoteRequests();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update quote request",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await dealerApi.downloadQuoteRequests();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quote-requests.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Success",
        description: "Quote requests downloaded successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to download quote requests",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return format(date, 'PPp');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  const filteredRequests = quoteRequests.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (request.userName?.toLowerCase() || '').includes(searchLower) ||
      (request.userFullName?.toLowerCase() || '').includes(searchLower) ||
      (request.vehicleName?.toLowerCase() || '').includes(searchLower) ||
      (request.notes?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handlePageSizeChange = (value) => {
    setPageSize(value === 'all' ? 1000 : parseInt(value));
    setCurrentPage(0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quote Requests</h1>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle>All Requests</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, vehicle, or notes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="all">Show all</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quoted Price</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.userName}</TableCell>
                  <TableCell>{request.userFullName}</TableCell>
                  <TableCell>{request.vehicleName}</TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {request.quotedPrice ? `$${request.quotedPrice}` : '-'}
                  </TableCell>
                  <TableCell>{request.notes || '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {request.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(request.id, 'APPROVED', 50000, 'Your quote has been approved')}
                            >
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(request.id, 'REJECTED', null, 'Your quote has been rejected')}
                            >
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}