"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function CodeManagementPage() {
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newTypeName, setNewTypeName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchVehicleTypes = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("http://localhost:8080/api/vehicle-types", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch vehicle types")
      }

      const data = await response.json()
      setVehicleTypes(data)
    } catch (error) {
      console.error("Error fetching vehicle types:", error)
      toast.error(error.message || "Failed to load vehicle types")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicleTypes()
  }, [])

  const handleAddType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Please enter a type name")
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("http://localhost:8080/api/vehicle-types", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newTypeName.trim() })
      })

      if (!response.ok) {
        throw new Error("Failed to add vehicle type")
      }

      toast.success("Vehicle type added successfully")
      setNewTypeName("")
      setShowAddDialog(false)
      fetchVehicleTypes()
    } catch (error) {
      console.error("Error adding vehicle type:", error)
      toast.error(error.message || "Failed to add vehicle type")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteType = async (id) => {
    if (!confirm("Are you sure you want to delete this vehicle type?")) {
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`http://localhost:8080/api/vehicle-types/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete vehicle type")
      }

      toast.success("Vehicle type deleted successfully")
      fetchVehicleTypes()
    } catch (error) {
      console.error("Error deleting vehicle type:", error)
      toast.error(error.message || "Failed to delete vehicle type")
    }
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
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Code Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Types</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.id}</TableCell>
                  <TableCell>{type.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteType(type.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vehicle Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="typeName" className="text-sm font-medium">
                Type Name
              </label>
              <Input
                id="typeName"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="Enter vehicle type name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddType} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Type"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 