"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Download } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BulkImportPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewData(null)
      setValidationErrors([])

      try {
        const data = await selectedFile.arrayBuffer()
        const workbook = XLSX.read(data)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Validate data
        const requiredFields = ["name", "description", "fuelType", "color", "price", "type"]
        const errors = []
        
        jsonData.forEach((row, index) => {
          const rowErrors = []
          requiredFields.forEach(field => {
            if (row[field] === undefined || row[field] === null || row[field] === "") {
              rowErrors.push(`${field} is required`)
            }
          })
          
          // Validate price is a number
          if (row.price && isNaN(Number(row.price))) {
            rowErrors.push("price must be a number")
          }

          if (rowErrors.length > 0) {
            errors.push({
              row: index + 1,
              errors: rowErrors
            })
          }
        })

        if (errors.length > 0) {
          setValidationErrors(errors)
          toast.error("Some rows have validation errors. Please check the preview table.")
        } else {
          setPreviewData(jsonData)
          toast.success("File loaded successfully. Please review the data before importing.")
        }
      } catch (error) {
        console.error("Error reading file:", error)
        toast.error("Error reading file. Please check the file format.")
      }
    }
  }

  const downloadTemplate = () => {
    // Create sample data
    const sampleData = [
      {
        name: "Creta",
        description: "A mid budget beast for family",
        fuelType: "PETROL",
        color: "Red",
        price: 1250000.00,
        type: "SUV"
      },
      {
        name: "Kia Syros",
        description: "A low budget beast for family",
        fuelType: "ELECTRIC",
        color: "Blue",
        price: 750000.00,
        type: "ELECTRIC"
      }
    ]

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(sampleData)
    
    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Vehicles")

    // Generate and download file
    XLSX.writeFile(wb, "vehicle_import_template.xlsx")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !previewData) {
      toast.error("Please select a valid file")
      return
    }

    if (validationErrors.length > 0) {
      toast.error("Please fix validation errors before importing")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("http://localhost:8080/api/vehicles/bulk-import", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ vehicles: previewData })
      })

      if (!response.ok) {
        throw new Error("Failed to import vehicles")
      }

      toast.success("Vehicles imported successfully")
      router.push("/admin/vehicles")
    } catch (error) {
      console.error("Import error:", error)
      toast.error(error.message || "Failed to import vehicles")
    } finally {
      setIsLoading(false)
    }
  }

  // Format price to INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Link href="/admin/vehicles">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vehicles
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Bulk Import Vehicles</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Vehicles</CardTitle>
            <CardDescription>
              Import multiple vehicles at once by uploading an Excel or CSV file.
              <br />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={downloadTemplate}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="file">Upload File (Excel/CSV)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: Excel (.xlsx, .xls) or CSV
                </p>
              </div>

              {previewData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preview Data</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Fuel Type</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((vehicle, index) => (
                          <TableRow key={index}>
                            <TableCell>{vehicle.name}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{vehicle.description}</TableCell>
                            <TableCell>{vehicle.fuelType}</TableCell>
                            <TableCell>{vehicle.color}</TableCell>
                            <TableCell>{formatPrice(vehicle.price)}</TableCell>
                            <TableCell>{vehicle.type}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {validationErrors.length > 0 && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4">
                      <h4 className="text-sm font-medium text-red-800">Validation Errors</h4>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-red-700">
                        {validationErrors.map((error, index) => (
                          <li key={index}>
                            Row {error.row}: {error.errors.join(", ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading || !previewData || validationErrors.length > 0}
              >
                {isLoading ? "Importing..." : "Import Vehicles"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 