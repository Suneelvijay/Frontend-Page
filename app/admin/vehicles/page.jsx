"use client"

import { useState, useEffect } from "react"
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
import { Plus, Search, MoreHorizontal, Edit, Trash, FileUp, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all")
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  
  const fetchVehicles = async (page = 0) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setError("Authentication required")
        return
      }
      
      const response = await fetch("http://localhost:8080/api/vehicles/list", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          page: page,
          size: pageSize
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles")
      }
      
      const data = await response.json()
      setVehicles(data.content || [])
      setTotalPages(data.totalPages || 1)
      setCurrentPage(page)
      
    } catch (error) {
      console.error("Error fetching vehicles:", error)
      setError(error.message || "Failed to load vehicles")
      toast.error("Failed to load vehicles")
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchVehicles(0)
  }, [pageSize])
  
  const handlePageChange = (page) => {
    fetchVehicles(page)
  }
  
  const handleDeleteVehicle = async (vehicleId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        toast.error("Authentication required")
        return
      }
      
      const response = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete vehicle")
      }
      
      toast.success("Vehicle deleted successfully")
      fetchVehicles(currentPage)
      
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      toast.error(error.message || "Failed to delete vehicle")
    }
  }
  
  // Filter vehicles based on search term and fuel type
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      (vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      vehicle.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.color?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFuelType = fuelTypeFilter === "all" || 
      vehicle.fuelType?.toLowerCase() === fuelTypeFilter.toLowerCase();
      
    return matchesSearch && matchesFuelType;
  });

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Manage Vehicles</h1>
          <div className="flex space-x-2">
            <Link href="/admin/vehicles/import">
              <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Import
              </Button>
            </Link>
            <Link href="/admin/vehicles/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Inventory</CardTitle>
            <CardDescription>Manage your vehicle inventory. Add, edit, or remove vehicles.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search vehicles..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select 
                  defaultValue="all"
                  onValueChange={(value) => setFuelTypeFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fuel Types</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Fuel Type</TableHead>
                      <TableHead className="hidden sm:table-cell">Color</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            Loading vehicles...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-red-500">
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : filteredVehicles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No vehicles found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell>
                            {vehicle.image ? (
                              <img
                                src={`data:image/jpeg;base64,${vehicle.image}`}
                                alt={vehicle.name}
                                className="h-10 w-16 rounded object-cover"
                              />
                            ) : (
                              <img
                                src="/placeholder.svg"
                                alt={vehicle.name}
                                className="h-10 w-16 rounded object-cover"
                              />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{vehicle.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{vehicle.description}</TableCell>
                          <TableCell>{vehicle.fuelType}</TableCell>
                          <TableCell className="hidden sm:table-cell">{vehicle.color}</TableCell>
                          <TableCell>₹{Number(vehicle.price).toLocaleString()}</TableCell>
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
                                  <Link href={`/admin/vehicles/${vehicle.id}`} className="flex w-full items-center">
                                    View details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Link
                                    href={`/admin/vehicles/edit/${vehicle.id}`}
                                    className="flex w-full items-center"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the vehicle "{vehicle.name}" from the system.
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleDeleteVehicle(vehicle.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 0))}
                        disabled={currentPage === 0 || isLoading}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages).keys()].map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          disabled={isLoading}
                        >
                          {page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages - 1))}
                        disabled={currentPage === totalPages - 1 || isLoading}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Items per page:</span>
                  <Select 
                    value={pageSize.toString()} 
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setCurrentPage(0)
                    }}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}