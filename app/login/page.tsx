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
import { Eye, EyeOff } from "lucide-react"
import { ActiveSessionDialog } from "@/components/ui/active-session-dialog"

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
  const [showPassword, setShowPassword] = useState(false)
  const [showActiveSessionDialog, setShowActiveSessionDialog] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleLogin = async (forceLogin = false) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          ...(forceLogin && { forceLogin: true }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle account expiration error
        if (data.error && data.error.includes("Your account has expired")) {
          throw new Error(data.error)
        }
        // Handle account lock error
        if (data.error && data.error.includes("Account is temporarily blocked")) {
          const remainingTime = data.remainingBlockTime
          throw new Error(`Account is temporarily blocked. Please try again after ${remainingTime} minutes.`)
        }
        // Handle active session error
        if (response.status === 409 && data.hasActiveSession) {
          setShowActiveSessionDialog(true)
          return
        }
        throw new Error(data.message || "Login failed")
      }

      // Store email for OTP verification
      setUserEmail(data.email)
      
      // Show OTP dialog
      setShowOTPDialog(true)
      toast.success("OTP has been sent to your email")
    } catch (err: any) {
      setError(err.message || "Login failed")
      toast.error(err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    await handleLogin()
  }

  const handleForceLogin = async () => {
    setShowActiveSessionDialog(false)
    setIsLoading(true)
    await handleLogin(true)
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

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    
    // Handle short usernames (less than 4 characters)
    if (username.length <= 4) {
      return `${username[0]}${'*'.repeat(Math.max(username.length - 1, 1))}@${domain}`;
    }

    const firstTwo = username.slice(0, 2);
    const lastTwo = username.slice(-2);
    const maskedUsername = `${firstTwo}${'*'.repeat(username.length - 4)}${lastTwo}`;
    return `${maskedUsername}@${domain}`;
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
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
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
        email={maskEmail(userEmail)}
        onClose={() => setShowOTPDialog(false)}
        onVerify={handleVerifyOTP}
        isLogin={true}
      />

      <ActiveSessionDialog
        isOpen={showActiveSessionDialog}
        onClose={() => setShowActiveSessionDialog(false)}
        onConfirm={handleForceLogin}
      />
    </div>
  )
}