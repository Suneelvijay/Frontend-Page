"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, FileSpreadsheet, AlertCircle, CheckCircle2, Download } from "lucide-react"

export default function ImportVehiclesPage() {
  const [file, setFile] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [importStatus, setImportStatus] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Simulate parsing CSV/Excel file
      // In a real application, you would use a library like papaparse or xlsx
      setTimeout(() => {
        const mockData = [
          { name: "Kia Seltos HTX", description: "Premium SUV", fuelType: "Petrol", color: "White", price: "1289000" },
          { name: "Kia Sonet GTX+", description: "Compact SUV", fuelType: "Diesel", color: "Red", price: "1379000" },
          { name: "Kia Carens Luxury", description: "MPV", fuelType: "Petrol", color: "Blue", price: "1179000" },
        ]
        setPreviewData(mockData)
      }, 500)
    }
  }

  const handleImport = () => {
    // Simulate import process
    setImportStatus("processing")
    setTimeout(() => {
      setImportStatus("success")
    }, 2000)
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
          <h1 className="text-2xl font-bold tracking-tight">Import Vehicles</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Vehicles from Excel/CSV</CardTitle>
            <CardDescription>Upload an Excel or CSV file to bulk import vehicles into the inventory.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileSpreadsheet className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Excel or CSV file (MAX. 10MB)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && (
                <p className="text-sm text-center">
                  Selected file: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="mr-2">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            {importStatus === "processing" && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Processing</AlertTitle>
                <AlertDescription>Importing vehicles. Please wait...</AlertDescription>
              </Alert>
            )}

            {importStatus === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Success</AlertTitle>
                <AlertDescription>Successfully imported {previewData?.length || 0} vehicles.</AlertDescription>
              </Alert>
            )}

            {previewData && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Preview Data</h3>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Fuel Type</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Price (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.fuelType}</TableCell>
                          <TableCell>{row.color}</TableCell>
                          <TableCell>{row.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleImport}
              disabled={!previewData || importStatus === "processing" || importStatus === "success"}
            >
              Import Vehicles
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
