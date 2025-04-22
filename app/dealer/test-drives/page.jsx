"use client"

import { useState, useEffect } from 'react';
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
import { MoreHorizontal, Search, Download, ArrowUpDown } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function TestDrives() {
  const { toast } = useToast();
  const router = useRouter();
  const [testDrives, setTestDrives] = useState([]);
  const [filteredTestDrives, setFilteredTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchTestDrives();
  }, [currentPage, pageSize, statusFilter]);

  useEffect(() => {
    // Filter and sort test drives
    let filtered = [...testDrives];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.userName?.toLowerCase().includes(searchLower) ||
        request.userEmail?.toLowerCase().includes(searchLower) ||
        request.vehicleName?.toLowerCase().includes(searchLower) ||
        request.notes?.toLowerCase().includes(searchLower) ||
        formatDate(request.requestedDate).toLowerCase().includes(searchLower) ||
        request.status?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.requestedDate);
      const dateB = new Date(b.requestedDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredTestDrives(filtered);
  }, [searchQuery, testDrives, sortOrder]);

  const fetchTestDrives = async () => {
    try {
      setLoading(true);
      const response = await dealerApi.getTestDriveRequests(currentPage, pageSize, statusFilter);
      setTestDrives(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch test drive requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await dealerApi.updateTestDriveStatus(requestId, status);
      toast({
        title: "Success",
        description: "Test drive status updated successfully",
      });
      fetchTestDrives();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update test drive status",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await dealerApi.downloadTestDrives();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test-drives.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download test drives",
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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'destructive';
      case 'CANCELLED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handlePageSizeChange = (value) => {
    const newSize = value === 'all' ? 1000 : parseInt(value);
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Drive Requests</h1>
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
                  placeholder="Search by name, email, vehicle, notes, date, or status..."
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
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={toggleSortOrder}
                    className="flex items-center gap-1"
                  >
                    Requested Date
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestDrives.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.userName}</p>
                      <p className="text-sm text-muted-foreground">{request.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.vehicleName}</TableCell>
                  <TableCell>{formatDate(request.requestedDate)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/dealer/test-drives/${request.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        {request.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'APPROVED')}>
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'REJECTED')}>
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {request.status === 'APPROVED' && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'CANCELLED')}>
                            Cancel
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredTestDrives.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No test drive requests match your search' : 'No test drive requests found'}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
