 "use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { OTPDialog } from "@/components/ui/otp-dialog"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showOTPDialog, setShowOTPDialog] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Step 1: First login request
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store email for OTP verification
      setUserEmail(data.email)
      
      // Show OTP dialog
      setShowOTPDialog(true)
      toast.success("OTP has been sent to your email")
    } catch (err: any) {
      setError(err.message || "Login failed")
      toast.error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (otp: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/auth/verify-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          otp: parseInt(otp, 10),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Verification failed")
      }

      // Create a userData object with the response properties
      const userData = {
        id: data.id,
        email: data.email,
        username: data.username,
        role: data.role,
        lastLogin: data.lastLogin
      }

      // Store token and userData in localStorage
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("userData", JSON.stringify(userData))

      toast.success("Login successful")
      
      // Redirect based on user role
      if (data.role === "ADMIN") {
        router.push("/admin")
      } else if (data.role === "DEALER") {
        router.push("/dealer")
      } else {
        // Default for USER role
        router.push("/customer/vehicles")
      }
    } catch (err: any) {
      toast.error(err.message || "Verification failed")
    } finally {
      setIsLoading(false)
      setShowOTPDialog(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your username and password to access the dealer management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                value={formData.username}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>

      <OTPDialog
        isOpen={showOTPDialog}
        email={userEmail}
        onClose={() => setShowOTPDialog(false)}
        onVerify={handleVerifyOTP}
        isLogin={true}
      />
    </div>
  )
}