"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image" // Add this import
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, FileType, AlertCircle, CheckCircle2, X } from "lucide-react"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export default function ImportVehiclesPage() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importResult, setImportResult] = useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv") || 
                         droppedFile.type === "application/vnd.ms-excel" || 
                         droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
                         droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls"))) {
      setFile(droppedFile)
    } else {
      toast.error("Please upload a valid CSV or Excel file")
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setImportResult(null)
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setImportResult(null)
    
    // Create form data
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        toast.error("Authentication required")
        router.push("/login")
        return
      }
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)
      
      const response = await fetch("http://192.168.125.84:8080/api/vehicles/import", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })

      // Clear interval and set to 100% when done
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to import vehicles")
      }
      
      const result = await response.json()
      setImportResult(result)
      toast.success("Vehicles imported successfully")
      
    } catch (error) {
      toast.error(error.message || "Failed to import vehicles")
      console.error("Import error:", error)
      setImportResult({
        success: false,
        message: error.message || "Failed to import vehicles"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadTemplate = () => {
    // CSV header with all required fields
    const headers = ["Name", "Description", "Price", "FuelType", "Color", "Type", "Image"];
    
    // Sample data rows with placeholder image path
    const sampleRows = [
      ["Kia Seltos", "Compact SUV with advanced features", "989000", "PETROL", "White", "SUV", "/placeholder.svg"],
      ["Kia Sonet", "Subcompact SUV with premium features", "779000", "DIESEL", "Red", "SUV", "/placeholder.svg"],
      ["Kia EV6", "All-electric crossover", "6095000", "ELECTRIC", "Blue", "ELECTRIC", "/placeholder.svg"]
    ];
    
    // Combine header and rows
    const csvContent = [
      headers.join(","),
      ...sampleRows.map(row => row.join(","))
    ].join("\n");
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create a temporary download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "vehicle_import_template.csv");
    link.style.visibility = "hidden";
    
    // Append to the document, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileSize = () => {
    if (!file) return ""
    
    const sizeInKB = file.size / 1024
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(2)} KB`
    } else {
      const sizeInMB = sizeInKB / 1024
      return `${sizeInMB.toFixed(2)} MB`
    }
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
            <CardTitle>Import Vehicle Data</CardTitle>
            <CardDescription>
              Upload a CSV or Excel file containing vehicle data to import multiple vehicles at once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <div
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${
                  isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <Upload className="w-10 h-10 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV or Excel files (MAX. 10MB)</p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-md">
                      <FileType className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{getFileSize()}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
                
                {importResult && (
                  <Alert variant={importResult.success ? "default" : "destructive"}>
                    <div className="flex items-center">
                      {importResult.success ? (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-2" />
                      )}
                      <AlertTitle>
                        {importResult.success ? "Import Successful" : "Import Failed"}
                      </AlertTitle>
                    </div>
                    <AlertDescription>
                      {importResult.message}
                      {importResult.details && (
                        <ul className="mt-2 text-sm space-y-1">
                          {importResult.details.map((detail, index) => (
                            <li key={index}>• {detail}</li>
                          ))}
                        </ul>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">File Format Guidelines</h3>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• The CSV or Excel file should have the following columns: Name, Description, Price, FuelType, Color, Type, Image.</li>
                <li>• FuelType should be one of: PETROL, DIESEL, ELECTRIC, HYBRID.</li>
                <li>• Type should be one of: SUV, SEDAN, HATCHBACK, ELECTRIC.</li>
                <li>• Price should be a numeric value without currency symbols.</li>
                <li>• <strong>Image column</strong>: If left empty, the default placeholder will be used automatically.</li>
                <li>• You can also specify &quot;/placeholder.svg`&quot;` to use the default image.</li>
                <li>• The first row should contain the column headers.</li>
              </ul>
              <div className="flex items-center mt-4 space-x-2">
                <Button 
                  className="text-xs" 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadTemplate}
                >
                  Download Template
                </Button>
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground ml-2">Default placeholder image:</span>
                  <Image
                    src="/placeholder.svg"
                    alt="Placeholder"
                    width={40}
                    height={24}
                    className="ml-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/admin/vehicles")} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? "Importing..." : "Import Vehicles"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}